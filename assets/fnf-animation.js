var boyfriend={x:1260,y:350};
var position_key={
    ['j']:{ x:-10, y:0 },
    ['k']:{ x:0, y:10 },
    ['i']:{ x:0, y:-10 },
    ['l']:{ x:10, y:0 }
};//{['KeyBoard':{ x : y }]}
var sing_key={
    ['a']:{anim:'left',press:false},
    ['s']:{anim:'down',press:false},
    ['w']:{anim:'up',press:false},
    ['d']:{anim:'right',press:false},
    [' ']:{anim:'hey',press:false}
};//{['KeyBoard','animName']}
var animOffset={
    ['idle']:{x:0,y:0},
    ['left']:{x:7,y:-5},
    ['down']:{x:0,y:-50},
    ['up']:{x:-29,y:35},
    ['right']:{x:-35,y:-4}
};
var animOption={
    ['idle']:{
        maxIndex:14,
        sing:false,
        name:'BF idle dance'
    },
    ['left']:{
        maxIndex:15,
        sing:true,
        name:'BF NOTE LEFT'
    },
    ['down']:{
        maxIndex:30,
        sing:true,
        name:'BF NOTE DOWN'
    },
    ['up']:{
        maxIndex:15,
        sing:true,
        name:'BF NOTE UP'
    },
    ['right']:{
        maxIndex:62,
        sing:true,
        name:'BF NOTE RIGHT'
    }
};
var nowAnim={
    ['anim']:'idle',
    ['index']:0
};
var idleTimer,singTimer;
var nowOffset={x:0,y:0};

function onload() {
    boyfriend_sing('idle');
    document.addEventListener('keypress', keypress_event);
    document.addEventListener('keyup', keyup_event);
    boyfriend_Position_Change();
    frameRate();
}

function frameRate(){
    let fps = 0;
    let frameCount = 0;
    let startTime;
    let endTime;
    startTime = new Date().getTime();
    function animationLoop(){
        frameCount ++;
        endTime = new Date().getTime();
        if(endTime - startTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            startTime = new Date().getTime();
        }
        requestAnimationFrame(animationLoop);
        document.getElementById('frameRate').innerHTML='FPS : '+fps;
    }
    animationLoop();
}

function keypress_event(e) {
    try{
    if (position_key[e.key]!=null) boyfriend_Position_Change(position_key[e.key].x,position_key[e.key].y);
    
    if (sing_key[e.key]!=null) {
        if (sing_key[e.key].press==false) {
            nowAnim['index']=0;
            boyfriend_sing(sing_key[e.key].anim);
            sing_key[e.key].press=true;
        }
    }
    if (e.key==' ') alert(e);
    }catch(e){alert(e);}
}

function keyup_event(e) {
    if (sing_key[e.key]!=null && sing_key[e.key].press==true) sing_key[e.key].press=false;
}

function boyfriend_sing(animName) {
    try {clearTimeout(singTimer);} catch(e){}
    if (animOffset[animName]!=null) nowOffset=animOffset[animName];
    let nowAnimName=animName;
    nowAnim['anim']=nowAnimName;
    boyfriend_Position_Change();
    
    if (animOption[animName].sing==true) nowAnimName='sing/'+(animName.toUpperCase())+'/'+animOption[animName].name;
    else nowAnimName=animName+'/'+animOption[animName].name;
    
    if (nowAnim['index']==0) nowAnimName=animIndex(nowAnimName,0);
    else nowAnimName=animIndex(nowAnimName,nowAnim['index']);
    
    nowAnim['index']++;
    
    document.getElementById('boyfriend').src='anim/boyfriend/'+nowAnimName+'.png';
    if (nowAnim['index']==animOption[animName].maxIndex) {
        singTimer=setTimeout(() => {
            nowAnim['index']=0;
            boyfriend_sing('idle');
        }, 150);
    } else {
        singTimer=setTimeout(() => {
            boyfriend_sing(animName);
        }, 36);
    }
}

function animIndex(anim,index) {
    let _index='0000';
    _index+=index;
    return anim+_index.substr(-4);
}

function boyfriend_Position_Change(_x,_y) {
    if (_x==null || typeof(_x)!='number') _x=0;
    if (_y==null || typeof(_y)!='number') _y=0;
    try{
        /*
        if (nowAnim['anim']!='idle') {
            boyfriend.x -= nowOffset.x;
            boyfriend.y -= nowOffset.y;
        } else if (nowAnim['anim']=='idle') {
            boyfriend.x -= nowOffset.x;
            boyfriend.y -= nowOffset.y;
        }*/
        
        boyfriend.x -= nowOffset.x;
        boyfriend.y -= nowOffset.y;
        
        boyfriend.x += _x+nowOffset.x;
        boyfriend.y += _y+nowOffset.y;
        const bf = document.querySelector('.bf');
        bf.style.setProperty("left", (boyfriend.x-nowOffset.x)+'px');
        bf.style.setProperty("top", (boyfriend.y-nowOffset.y)+'px');
        document.getElementById('bf_position').innerHTML='x : '+(boyfriend.x/*-nowOffset.x*/)+' | y : '+(boyfriend.y/*-nowOffset.y*/)+' | index : '+ nowAnim['index'];
    } catch(e) {alert(e);}
}