let isotope_bf={x:250,y:0};
let iso_bf_sing_key={
    ['c']:{anim:'left',press:false,id:0},
    ['v']:{anim:'down',press:false,id:1},
    ['n']:{anim:'up',press:false,id:2},
    ['m']:{anim:'right',press:false,id:3},
    
    ['C']:{anim:'left-miss',press:false,id:0},
    ['V']:{anim:'down-miss',press:false,id:1},
    ['N']:{anim:'up-miss',press:false,id:2},
    ['M']:{anim:'right-miss',press:false,id:3}
};//{['KeyBoard','animName']}
let iso_bf_animOption={
    ['idle']:{
        offset:{ x:0, y:0 },
        maxIndex:14,
        sing:false,
        name:'Bf Idle Dance'
    },
    ['left']:{
        offset:{ x:150, y:0 },
        maxIndex:14,
        sing:true,
        name:'boyfriend left'
    },
    ['down']:{
        offset:{ x:0, y:-50 },
        maxIndex:14,
        sing:true,
        name:'boyfriend down'
    },
    ['up']:{
        offset:{ x:80, y:50 },
        maxIndex:14,
        sing:true,
        name:'boyfriend up'
    },
    ['right']:{
        offset:{ x:-20, y:20 },
        maxIndex:14,
        sing:true,
        name:'boyfriend right'
    },
    
    ['left-miss']:{
        offset:{ x:390, y:180 },
        maxIndex:14,
        sing:true,
        name:'boyfriend lef miss'
    },
    ['down-miss']:{
        offset:{ x:90, y:100 },
        maxIndex:13,
        sing:true,
        name:'boyfriend dow miss'
    },
    ['up-miss']:{
        offset:{ x:220, y:250 },
        maxIndex:14,
        sing:true,
        name:'boyfriend u miss'
    },
    ['right-miss']:{
        offset:{ x:30, y:160 },
        maxIndex:14,
        sing:true,
        name:'boyfriend righ miss'
    }
};
let iso_bf_strum={
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
let iso_bf_nowAnim={
    ['anim']:'idle',
    ['index']:0
};
let iso_bf_singTimer;
let iso_bf_nowOffset={x:0,y:0};

function onLoad_Isotope_Boyfriend() {
    iso_boyfriend_sing('idle');
    isotope_boyfriend_Position_Change();
    document.addEventListener('keypress', iso_bf_keypress_event);
    document.addEventListener('keyup', iso_bf_keyup_event);
}

function iso_bf_keypress_event(e) {
    if (stage=='base') {
        try{
            if (iso_bf_sing_key[e.key]!=null) {
                if (iso_bf_sing_key[e.key].press==false) {
                    iso_bf_nowAnim['index']=0;
                    isotope_boyfriend_StrumAnimChange(iso_bf_sing_key[e.key].id,iso_bf_sing_key[e.key].anim,true,false);
                    iso_boyfriend_sing(iso_bf_sing_key[e.key].anim);
                    iso_bf_sing_key[e.key].press=true;
                }
            }
        }catch(e){alert('iso_bf_keypress_event ERROR!! : '+e);}
    }
}

function iso_bf_keyup_event(e) {
    if (iso_bf_sing_key[e.key]!=null && iso_bf_sing_key[e.key].press==true) {
        iso_bf_sing_key[e.key].press=false;
        isotope_boyfriend_StrumAnimChange(iso_bf_sing_key[e.key].id,iso_bf_sing_key[e.key].anim,true,true);
    }
}

function iso_boyfriend_sing(animName) {
    try {clearTimeout(iso_bf_singTimer);} catch(e){}
    if (iso_bf_animOption[animName]!=null) iso_bf_nowOffset=iso_bf_animOption[animName].offset; else return;
    let nowAnimName=animName;
    iso_bf_nowAnim['anim']=nowAnimName;
    isotope_boyfriend_Position_Change();
    
    if (iso_bf_animOption[animName].sing==true) nowAnimName='sing/'+(animName.toUpperCase())+'/'+iso_bf_animOption[animName].name;
    else nowAnimName=animName+'/'+iso_bf_animOption[animName].name;
    
    if (iso_bf_nowAnim['index']==0) nowAnimName=animIndex(nowAnimName,0);
    else nowAnimName=animIndex(nowAnimName,iso_bf_nowAnim['index']);
    
    iso_bf_nowAnim['index']++;
    document.getElementById('iso-bf').src='anim/isotope-bf/'+nowAnimName+'.png';
    if (iso_bf_nowAnim['index']==iso_bf_animOption[animName].maxIndex) {
        iso_bf_singTimer=setTimeout(() => {
            iso_bf_nowAnim['index']=0;
            iso_boyfriend_sing('idle');
        }, returnIdleTime);
    } else {
        let timer=30;
        iso_bf_singTimer=setTimeout(() => {
            iso_boyfriend_sing(animName);
        }, timer);
    }
}

function isotope_boyfriend_StrumAnimChange(strumID,anim,first,reset) {
    if (strumID==null) return;
    let base=document.getElementById('base');
    let nowAnim=anim;
    if (nowAnim.endsWith('-miss')) nowAnim=nowAnim.replace('-miss','');
    let nowStrumAnim = nowAnim;
    if (first==true) {
        iso_bf_strum[nowAnim].index=0;
        iso_bf_strum[nowAnim].end=false;
        clearTimeout(iso_bf_strum[nowAnim].timer);
    }
    if (reset==true) {
        nowStrumAnim='arrow'+nowAnim.toUpperCase();
        if (anim.endsWith('-miss')) anim=anim.replace('-miss','');
    }
    try {
        if (!anim.endsWith('-miss')) {
            base.querySelector('#otherStrums'+strumID).classList.remove('press');
            base.querySelector('#otherStrums'+strumID).classList.add('relese');
        }
    } catch(e){}
    if (!nowStrumAnim.startsWith('arrow') && !anim.endsWith('-miss')) nowStrumAnim+=' confirm';
    if (anim.endsWith('-miss')) nowStrumAnim += ' press';
    if (iso_bf_strum[nowAnim].index==0) nowStrumAnim=animIndex(nowStrumAnim,0);
    else nowStrumAnim=animIndex(nowStrumAnim,iso_bf_strum[nowAnim].index);
    base.querySelector('#otherStrums'+strumID).src='note/'+nowAnim.toUpperCase()+'/'+nowStrumAnim+'.png';
    
    iso_bf_strum[nowAnim].index++;
    if (!nowStrumAnim.startsWith('arrow')) {
        if (!anim.endsWith('-miss')) {
            base.querySelector('#otherStrums'+strumID).classList.remove('relese');
            base.querySelector('#otherStrums'+strumID).classList.add('press');
        }
        if (iso_bf_strum[nowAnim].index==strumAnimLength) {
            iso_bf_strum[nowAnim].end=true;
            /*
            bf_strum[nowAnim].timer=setTimeout(() => {
                isotope_boyfriend_StrumAnimChange(strumID,nowAnim,true,true);
            }, 200);*/
        } else {
            if (!nowStrumAnim.startsWith('arrow')) {
                iso_bf_strum[nowAnim].timer=setTimeout(() => {
                    isotope_boyfriend_StrumAnimChange(strumID,anim,false,false);
                }, 50);
            }
        }
    }
}


function isotope_boyfriend_Position_Change(_x,_y) {
    if (_x==null || typeof(_x)!='number') _x=0;
    if (_y==null || typeof(_y)!='number') _y=0;
    try{
        isotope_bf.x -= iso_bf_nowOffset.x;
        isotope_bf.y -= iso_bf_nowOffset.y;
        
        isotope_bf.x += _x+iso_bf_nowOffset.x;
        isotope_bf.y += _y+iso_bf_nowOffset.y;
        const bf = document.querySelector('.isotope_bf');
        bf.style.setProperty("left", (isotope_bf.x-iso_bf_nowOffset.x)+'px');
        bf.style.setProperty("top", (isotope_bf.y-iso_bf_nowOffset.y)+'px');
    } catch(e) {alert(e);}
}