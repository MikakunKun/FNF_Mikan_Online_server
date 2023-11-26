let pikachu={x:300,y:525};
let p_s={
    ['a']:{anim:'left',press:false,id:0},
    ['s']:{anim:'down',press:false,id:1},
    ['d']:{anim:'up',press:false,id:2},
    ['f']:{anim:'right',press:false,id:3}
};//{['KeyBoard','animName']}
let p_a={
    ['idle']:{
        offset:{ x:0, y:0 },
        maxIndex:3,
        sing:false,
        file:'idle',
        name:'partner-pikachu idle'
    },
    ['left']:{
        offset:{ x:15, y:25 },
        maxIndex:2,
        sing:true,
        file:'sing/RIGHT',
        name:'partner-pikachu right'
    },
    ['down']:{
        offset:{ x:-20, y:-20 },
        maxIndex:2,
        sing:true,
        file:'sing/DOWN',
        name:'partner-pikachu down'
    },
    ['up']:{
        offset:{ x:-37, y:40 },
        maxIndex:2,
        sing:true,
        file:'sing/UP',
        name:'partner-pikachu up'
    },
    ['right']:{
        offset:{ x:-40, y:-10 },
        maxIndex:2,
        sing:true,
        file:'sing/LEFT',
        name:'partner-pikachu left'
    }
};
let p_strum={
    ['left']:{
        "index":0,
        "timer":null,
        "end":false
    },
    ['down']:{
        "index":0,
        "timer":null,
        "end":false
    },
    ['up']:{
        "index":0,
        "timer":null,
        "end":false
    },
    ['right']:{
        "index":0,
        "timer":null,
        "end":false
    }
}
let p_nA={
    ['anim']:'idle',
    ['index']:0
};
let p_singTimer;
let p_nowOffset={x:0,y:0};

function onLoad_Pikachu() {
    p_sing('idle');
    p_Position_Change();
    document.addEventListener('keypress', p_keypress_event);
    document.addEventListener('keyup', p_keyup_event);
}

function p_keypress_event(e) {
    if (stage=='town') {
        try{
            if (p_s[e.key]!=null) {
                if (p_s[e.key].press==false) {
                    p_nA['index']=0;
                    p_StrumAnimChange(p_s[e.key].id,p_s[e.key].anim,true,false);
                    p_sing(p_s[e.key].anim);
                    p_s[e.key].press=true;
                }
            }
        }catch(e){alert('pikachu_keypress_event ERROR!! : '+e);}
    }
}

function p_keyup_event(e) {
    if (p_s[e.key]!=null && p_s[e.key].press==true) {
        p_s[e.key].press=false;
        p_StrumAnimChange(p_s[e.key].id,p_s[e.key].anim,true,true);
    }
}

function p_sing(animName) {
    try {clearTimeout(p_singTimer);} catch(e){}
    if (p_a[animName]!=null) p_nowOffset=p_a[animName].offset; else return;
    let nowAnimName=animName;
    p_nA['anim']=nowAnimName;
    p_Position_Change();
    
    nowAnimName=p_a[animName].file+'/'+p_a[animName].name;
    
    if (p_nA['index']==0) nowAnimName+='0';
    else nowAnimName+=p_nA['index'];
    
    p_nA['index']++;
    
    document.getElementById('pikachu').src='anim/partner-pikachu/'+nowAnimName+'.png';
    if (p_nA['index']==1) {
        let image = new Image();
        //img要素からsrc属性の値を取得
        //Imageオブジェクトのsrcプロパティに代入    
        image.src = document.getElementById('pikachu').getAttribute('src');
        image.onload = function() {
            //画像の横幅をimg要素のwidth属性の値に設定
        //    document.getElementById('pikachu').setAttribute('width', image.width);
            
            //画像の高さをimg要素のheight属性の値に設定
            document.getElementById('pikachu').setAttribute('height', image.height);
        }
    }
    if (p_nA['index']==p_a[animName].maxIndex) {
        p_singTimer=setTimeout(() => {
            p_nA['index']=0;
            p_sing('idle');
        }, returnIdleTime);
    } else {
        let timer=80;
        if (puro_animOption[animName].sing==true) timer=200;
        p_singTimer=setTimeout(() => {
            p_sing(animName);
        }, timer);
    }
}

function p_StrumAnimChange(strumID,anim,first,reset) {
    if (strumID==null) return;
    let base=document.getElementById('pokedun');
    let nowAnim=anim;
    if (nowAnim.endsWith('-miss')) nowAnim=nowAnim.replace('-miss','');
    let nowStrumAnim = nowAnim;
    if (first==true) {
        p_strum[nowAnim].index=0;
        p_strum[nowAnim].end=false;
        clearTimeout(p_strum[nowAnim].timer);
    }
    if (reset==true) {
        nowStrumAnim='arrow'+nowAnim.toUpperCase();
        if (anim.endsWith('-miss')) anim=anim.replace('-miss','');
    }
    try {
        if (!anim.endsWith('-miss')) {
            base.querySelector('#opponentStrums'+strumID).classList.remove('press');
            base.querySelector('#opponentStrums'+strumID).classList.add('relese');
        }
    } catch(e){}
    if (!nowStrumAnim.startsWith('arrow') && !anim.endsWith('-miss')) nowStrumAnim+=' confirm';
    if (anim.endsWith('-miss')) nowStrumAnim += ' press';
    if (p_strum[nowAnim].index==0) nowStrumAnim=animIndex(nowStrumAnim,0);
    else nowStrumAnim=animIndex(nowStrumAnim,p_strum[nowAnim].index);
    base.querySelector('#opponentStrums'+strumID).src='note/'+nowAnim.toUpperCase()+'/'+nowStrumAnim+'.png';
    
    p_strum[nowAnim].index++;
    if (!nowStrumAnim.startsWith('arrow')) {
        if (!anim.endsWith('-miss')) {
            base.querySelector('#opponentStrums'+strumID).classList.remove('relese');
            base.querySelector('#opponentStrums'+strumID).classList.add('press');
        }
        if (p_strum[nowAnim].index==strumAnimLength) {
            p_strum[nowAnim].end=true;
            /*
            bf_strum[nowAnim].timer=setTimeout(() => {
                boyfriend_StrumAnimChange(strumID,nowAnim,true,true);
            }, 200);*/
        } else {
            if (!nowStrumAnim.startsWith('arrow')) {
                p_strum[nowAnim].timer=setTimeout(() => {
                    p_StrumAnimChange(strumID,anim,false,false);
                }, 50);
            }
        }
    }
}


function p_Position_Change(_x,_y) {
    if (_x==null || typeof(_x)!='number') _x=0;
    if (_y==null || typeof(_y)!='number') _y=0;
    try{
        pikachu.x -= p_nowOffset.x;
        pikachu.y -= p_nowOffset.y;
        
        pikachu.x += _x+p_nowOffset.x;
        pikachu.y += _y+p_nowOffset.y;
        const pika = document.querySelector('.pikachu');
        pika.style.setProperty("left", (pikachu.x-p_nowOffset.x)+'px');
        pika.style.setProperty("top", (pikachu.y-p_nowOffset.y)+'px');
    } catch(e) {alert(e);}
}