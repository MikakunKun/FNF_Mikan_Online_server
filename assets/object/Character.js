var returnIdleTime=300;
function playAnim(animName,first,character) {
    if (first==true) character.nowAnim.index=0;
    try {clearTimeout(character.animTimer);} catch(e){}
    if (character.animOption[animName]!=null) character.offset=character.animOption[animName].offset; else return;
    let nowAnimName=animName;
    character.nowAnim.anim=nowAnimName;
    character.update();
    
    if (character.animOption[animName].sing==true) nowAnimName='sing/'+(animName.toUpperCase())+'/'+character.animOption[animName].name;
    else nowAnimName=animName+'/'+character.animOption[animName].name;
    
    if (character.nowAnim.index==0) nowAnimName=animIndex(nowAnimName,0);
    else nowAnimName=animIndex(nowAnimName,character.nowAnim.index);
    
    character.nowAnim.index++;
    
    document.getElementById(character.id).src='anim/'+character.characterFile+'/'+nowAnimName+'.png';
    if (character.nowAnim.index==character.animOption[animName].maxIndex) {
        character.animTimer=setTimeout(() => {
            character.nowAnim.index=0;
            playAnim('idle',true,character);
        }, returnIdleTime);
    } else {
        let timer=30;
        character.animTimer=setTimeout(() => {
            playAnim(animName,false,character);
        }, timer);
    }
}
var playerChara='boyfriend';
var opponentChara='puro';

function setUP_Character(isPlayer,character) {
    let returnAnimOption={};
    let fileName='';
    if (isPlayer) {
        switch(playerChara) {
            default://'js/characters/boyfriend.js'
                returnAnimOption=boyfriend_animOption;
                fileName=boyfriend_File;
        }
    }else{
        switch(opponentChara) {
            default://'js/characters/puro.js'
                returnAnimOption=puro_animOption;
                fileName=puro_File;
            }
    }
    character.animOption=returnAnimOption;
    character.characterFile=fileName;
}