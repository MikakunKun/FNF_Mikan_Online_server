let player={
    id:'player',
    x:630,
    y:275,
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
        try{
            this.x -= this.offset.x;
            this.y -= this.offset.y;
            
            this.x += _x+this.offset.x;
            this.y += _y+this.offset.y;
            const _player = document.querySelector('.player');
            _player.style.setProperty("left", (this.x-this.offset.x)+'px');
            _player.style.setProperty("top", (this.y-this.offset.y)+'px');
        } catch(e) {alert(e);}
    }
};
let sing_key={
    [3]:{
        ['d']:{anim:'left',press:false,id:0},
        ['f']:{anim:'down',press:false,id:1},
        ['j']:{anim:'up',press:false,id:2},
        ['k']:{anim:'right',press:false,id:3},

        ['D']:{anim:'left-miss',press:false,id:0},
        ['F']:{anim:'down-miss',press:false,id:1},
        ['J']:{anim:'up-miss',press:false,id:2},
        ['K']:{anim:'right-miss',press:false,id:3}
    }
};//{['KeyBoard','animName']}

function onLoad_Player() {
    setUP_Character(true,player);
    playAnim('idle',true,player);
    player.update();
    document.addEventListener('keypress', keyPress);
    document.addEventListener('keyup', keyRelese);
}

function keyPress(e) {
    try{
        if (sing_key[mania][e.key]!=null) {
            if (sing_key[mania][e.key].press==false) {
                noteJustPress(sing_key[mania][e.key].id,'playerStrums');
                sing_key[mania][e.key].press=true;
            }
            notePress(sing_key[mania][e.key].id,'playerStrums');
        }
    }catch(e){alert('bf_keypress_event ERROR!! : '+e);}
}

function keyRelese(e) {
    if (sing_key[mania][e.key]!=null && sing_key[mania][e.key].press==true) {
        sing_key[mania][e.key].press=false;
        noteRelese(sing_key[mania][e.key].id);
    }
}

function playerSing(animName,first) {
    if (first==true) player.nowAnim['index']=0;
    try {clearTimeout(player.animTimer);} catch(e){}
    if (player.animOption[animName]!=null) player.offset=player.animOption[animName].offset; else return;
    let nowAnimName=animName;
    player.nowAnim['anim']=nowAnimName;
    player.update();
    
    if (player.animOption[animName].sing==true) nowAnimName='sing/'+(animName.toUpperCase())+'/'+player.animOption[animName].name;
    else nowAnimName=animName+'/'+player.animOption[animName].name;
    
    if (player.nowAnim['index']==0) nowAnimName=animIndex(nowAnimName,0);
    else nowAnimName=animIndex(nowAnimName,player.nowAnim['index']);
    
    player.nowAnim['index']++;
    
    document.getElementById('boyfriend').src='anim/boyfriend/'+nowAnimName+'.png';
    if (player.nowAnim['index']==player.animOption[animName].maxIndex) {
        player.animTimer=setTimeout(() => {
            player.nowAnim['index']=0;
            playerSing('idle',true);
        }, returnIdleTime);
    } else {
        let timer=30;
        player.animTimer=setTimeout(() => {
            playerSing(animName,false);
        }, timer);
    }
}

function playerStrum_playAnim(strumID,anim,first,reset) {
    if (strumID==null) return;
    let nowAnim=anim;
    if (nowAnim.endsWith('-miss')) nowAnim=nowAnim.replace('-miss','');
    let nowStrumAnim = nowAnim;
    if (first==true) {
        player.strum[nowAnim].index=0;
        player.strum[nowAnim].end=false;
        clearTimeout(player.strum[nowAnim].timer);
    }
    if (reset==true) {
        nowStrumAnim='arrow/arrow'+nowAnim.toUpperCase();
        if (anim.endsWith('-miss')) anim=anim.replace('-miss','');
    }
    try {
        if (!anim.endsWith('-miss')) {
            document.getElementById('playerStrums'+strumID).classList.remove('press');
            document.getElementById('playerStrums'+strumID).classList.add('relese');
        }
    } catch(e){}
    if (!nowStrumAnim.startsWith('arrow') && !anim.endsWith('-miss')) nowStrumAnim=nowAnim.toUpperCase()+'/'+nowStrumAnim+' confirm';
    if (anim.endsWith('-miss')) nowStrumAnim=nowAnim.toUpperCase()+'/'+nowStrumAnim+' press';
    if (player.strum[nowAnim].index==0) nowStrumAnim=animIndex(nowStrumAnim,0);
    else nowStrumAnim=animIndex(nowStrumAnim,player.strum[nowAnim].index);
    document.getElementById('playerStrums'+strumID).src='note/Strums/'+nowStrumAnim+'.png';
    
    player.strum[nowAnim].index++;
    if (!nowStrumAnim.startsWith('arrow')) {
        if (!anim.endsWith('-miss')) {
            document.getElementById('playerStrums'+strumID).classList.remove('relese');
            document.getElementById('playerStrums'+strumID).classList.add('press');
        }
        if (player.strum[nowAnim].index==strumAnimLength) {
            player.strum[nowAnim].end=true;
        } else {
            if (!nowStrumAnim.startsWith('arrow')) {
                player.strum[nowAnim].timer=setTimeout(() => {
                    playerStrum_playAnim(strumID,anim,false,false);
                }, 50);
            }
        }
    }
}