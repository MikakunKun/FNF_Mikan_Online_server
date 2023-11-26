let opponent={
    id:'opponent',
    x:70,
    y:250,
    animOption:{},
    strum:{
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
    },
    nowAnim:{
        anim:'idle',
        index:0
    },
    animTimer:null,
    offset:{x:0,y:0},
    characterFile:'',
    update(_x,_y) {
        if (_x==null || typeof(_x)!='number') _x=0;
        if (_y==null || typeof(_y)!='number') _y=0;
        this.x -= this.offset.x;
        this.y -= this.offset.y;
        
        this.x += _x+this.offset.x;
        this.y += _y+this.offset.y;
        const _opponent = document.querySelector('.opponent');
        _opponent.style.setProperty("left", (this.x-this.offset.x)+'px');
        _opponent.style.setProperty("top", (this.y-this.offset.y)+'px');
    }
};

function onLoad_Opponent() {
    setUP_Character(false,opponent);
    playAnim('idle',true,opponent);
    opponent.update();
}

function opponentSing(animName,first) {
    if (first==true) opponent.nowAnim['index']=0;
    try {clearTimeout(opponent.animTimer);} catch(e){}
    if (opponent.animOption[animName]!=null) opponent.offset=opponent.animOption[animName].offset; else return;
    let nowAnimName=animName;
    opponent.nowAnim['anim']=nowAnimName;
    opponent.update();
    
    if (opponent.animOption[animName].sing==true) nowAnimName='sing/'+(animName.toUpperCase())+'/'+opponent.animOption[animName].name;
    else nowAnimName=animName+'/'+opponent.animOption[animName].name;
    
    if (opponent.nowAnim['index']==0) nowAnimName=animIndex(nowAnimName,0);
    else nowAnimName=animIndex(nowAnimName,opponent.nowAnim['index']);
    
    opponent.nowAnim['index']++;
    
    document.getElementById('opponent').src='anim/'+opponent.characterFile+'/'+nowAnimName+'.png';
    if (opponent.nowAnim['index']==opponent.animOption[animName].maxIndex) {
        opponent.animTimer=setTimeout(() => {
            opponent.nowAnim['index']=0;
            opponentSing('idle',true);
        }, returnIdleTime);
    } else {
        let timer=30;
        opponent.animTimer=setTimeout(() => {
            opponentSing(animName,false);
        }, timer);
    }
}

function opponentStrum_playAnim(strumID,anim,first,reset) {
    if (strumID==null) return;
    let nowAnim=anim;
    if (nowAnim.endsWith('-miss')) nowAnim=nowAnim.replace('-miss','');
    let nowStrumAnim = nowAnim;
    if (first==true) {
        opponent.strum[nowAnim].index=0;
        opponent.strum[nowAnim].end=false;
        clearTimeout(opponent.strum[nowAnim].timer);
    }
    if (reset==true) {
        nowStrumAnim='arrow'+nowAnim.toUpperCase();
        if (anim.endsWith('-miss')) anim=anim.replace('-miss','');
    }
    try {
        if (!anim.endsWith('-miss')) {
            document.getElementById('opponentStrums'+strumID).classList.remove('press');
            document.getElementById('opponentStrums'+strumID).classList.add('relese');
        }
    } catch(e){}
    if (!nowStrumAnim.startsWith('arrow') && !anim.endsWith('-miss')) nowStrumAnim+=' confirm';
    if (anim.endsWith('-miss')) nowStrumAnim += ' press';
    if (opponent.strum[nowAnim].index==0) nowStrumAnim=animIndex(nowStrumAnim,0);
    else nowStrumAnim=animIndex(nowStrumAnim,opponent.strum[nowAnim].index);
    document.getElementById('opponentStrums'+strumID).src='note/Strums/'+nowAnim.toUpperCase()+'/'+nowStrumAnim+'.png';
    
    opponent.strum[nowAnim].index++;
    if (!nowStrumAnim.startsWith('arrow')) {
        if (!anim.endsWith('-miss')) {
            document.getElementById('opponentStrums'+strumID).classList.remove('relese');
            document.getElementById('opponentStrums'+strumID).classList.add('press');
        }
        if (opponent.strum[nowAnim].index==strumAnimLength) {
            opponent.strum[nowAnim].end=true;
        } else {
            if (!nowStrumAnim.startsWith('arrow')) {
                opponent.strum[nowAnim].timer=setTimeout(() => {
                    opponentStrum_playAnim(strumID,anim,false,false);
                }, 50);
            }
        }
    }
}