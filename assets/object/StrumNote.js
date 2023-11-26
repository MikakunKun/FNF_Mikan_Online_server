var STRUM_X = 42;
var STRUM_X_MIDDLESCROLL = -278;
var swagWidth = 160 * 0.7;

var strumLineNotes=[];
var playerStrums=[];
var opponentStrums=[];

function generateStaticArrow(isPlayer) {
    var strumLineX = ClientPrefs.data.middleScroll ? STRUM_X_MIDDLESCROLL : STRUM_X;
    var strumLineY = ClientPrefs.data.downScroll ? (window.innerHeight - 150) : 50;
    for (let i = 0; i < mania+1; i++) {
        // FlxG.log.add(i);
        var targetAlpha = 1;
        if (isPlayer==false) {
            if(!ClientPrefs.data.opponentStrums) targetAlpha = 0;
            else if(ClientPrefs.data.middleScroll) targetAlpha = 0.35;
        }

        var babyArrow = new StrumNote(strumLineX, strumLineY, i, player);
        babyArrow.downScroll = ClientPrefs.data.downScroll;
		babyArrow.alpha = targetAlpha;

		if (player == true) playerStrums.push(babyArrow);
		else opponentStrums.push(babyArrow);

		strumLineNotes.push(babyArrow);
		babyArrow.postAddedToGroup();
    }
}

class StrumNote {
    resetAnim=0.0;
    noteData=0;
    player=0;
    x=0;
    y=0;
    downScroll=false;
    alpha=1;
    nowAnim={
        "name":'',
        "index":0,
        "timer":null
    }
    resetAnim=0;
    sprite=null;
    constructor(x,y,leData,player) {
        this.noteData=leData;
        this.player=player;
        this.x=x;
        this.y=y;

        let _player=(player==0 ? 'playerStrums':'opponentStrums')
        this.sprite = document.createElement('img');
        this.sprite.id = noteData;
        this.sprite.style.position='absolute';
        this.sprite.style.width='108px';
        this.sprite.style.zIndex='950';
        document.getElementById('_'+_player.replace('Strums')).appendChild(this.new_element);
    }
    
    postAddedToGroup() {
		this.playAnim('static');
		this.x += swagWidth * this.noteData;
		this.x += 50;
		this.x += ((window.innerWidth / 2) * this.player);
		ID = this.noteData;
	}

    update(elapsed) {
		if(this.resetAnim > 0) {
			this.resetAnim -= elapsed;
			if(this.resetAnim <= 0) {
				this.playAnim('static');
				this.resetAnim = 0;
			}
		}
	}

    playAnim(anim,force) {
        var _anim=strumAnimName(anim,this.noteData);
        if (force==true) {
        } else {
            
        }
        this.sprite.src = _anim+'0000.png';
    }

    temp(anim) {
    }
}

/*
letter = noteAnim
anim = characterAnim
strumAnim = strumAnim
*/
var extraKeyData={
    "anim":{
        [3]:{
            "letter":['left','down','up','right'],
            "anim":['LEFT','DOWN','UP','RIGHT'],
            "strumAnim":['LEFT','DOWN','UP','RIGHT']
        }
    },
    "length":{
        ['left']:4,
        ['down']:4,
        ['up']:4,
        ['right']:4,
    }
};
function strumIndex(anim,strumAnim) {
    return animIndex(extraKeyData.length[strumAnim]);
}

function strumAnimFile(anim,noteData) {
    var _anim='arrow';
    if (anim!='static') {
        _anim=ekData('strumAnim',noteData);
    } return _anim+'/';
}
function strumAnimName(anim,noteData) {
    var _anim='arrow'+ekData('strumAnim',noteData);
    if (anim!='static') {
        _anim=ekData('letter',noteData);
        if(anim=='pressed') _anim+=' press';
        else if(anim=='confirm') _anim+=' confirm';
    }
    return _anim;
}

function ekData(option,data) {
    data = Math.abs(data%(mania+1));
    if (option=='letter') return extraKeyData.anim[mania].letter[data];
    else if(option=='anim') return extraKeyData.anim[mania].anim[data];
    else if(option=='strumAnim') return extraKeyData.anim[mania].strumAnim[data];
    else return extraKeyData.anim[mania].strumAnim[data];
}