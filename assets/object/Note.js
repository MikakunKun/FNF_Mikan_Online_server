var strumAnimLength=4;
var anim={
    [3]:{
        strum:['purple','blue','green','red'],
        chara:['left','down','up','right']
    }
};
var ratingStuff=[
    ['You Suck!', 0.2],    // 0% から 19%
    ['Shit', 0.4],    // 20% から 39%
    ['Bad', 0.5],    // 40% から 49%
    ['Bruh', 0.6],  // 50% から 59%
    ['Meh', 0.69],// 60% から 68%
    ['Nice', 0.7],  // 69%
    ['Good', 0.8],    // 70% から 79%
    ['Great', 0.9], // 80% から 89%
    ['Sick!', 1.0],  // 90% から 99%
    ['Perfect!!', 1.0] // 100%
];
var scales = [0.7, 0.7, 0.7, 0.7, 0.65, 0.6, 0.55, 0.5, 0.46];
var unspawnNotes = [];
var notes_Array = [];
var ratingsData = [];
var nums = [];
var ratings = [];

var songPosition = 0;
var songLength = 0;
var safeZoneOffset=0.0;
var noteKillOffset = 350;
var songSpeed=1;

var endingSong=false;
var ratingFC='';
var ratingName='?';
var score=0;

var totalPlayed=0;
var totalNotesHit=0.0;
var accuracy=0;

var marvelous = 0;
var sicks = 0;
var goods = 0;
var bads = 0;
var shits = 0;
var misses=0;

function endSong() {
    created_Song=false;
    endingSong=true;
}

function note_Update() {
    if (endingSong==false) {
        if (start==true) {
            if (voiceFind==true) songPosition = voice.currentTime*1000; else songPosition = inst.currentTime*1000;
            var remove=[];
            for (let note of unspawnNotes) {
                if (note.strumTime-songPosition<window.innerHeight) {
                    note.add();
                    note.spawn=true;
                    notes_Array.push(note);
                    remove.push(note);
                }
            }
            for (let _remove of remove) { unspawnNotes.splice(unspawnNotes.indexOf(_remove),1); }
            for(let value in sing_key[mania]) {
                if (sing_key[mania][value].press==true) notePress(sing_key[mania][value].id,'playerStrums');
            }
            for (let rating of ratings) {
                rating.update();
            }
        }
    }
    textUpdate();
    setTimeout(() => {
        notes_Array.forEach((value,key) => {
            value.update();
        });
        note_Update();
    },1);
}

function scoreTxt_setText() {
    var str = ratingName;
    if(totalPlayed != 0) {
        var percent = floorDecimal(accuracy * 100, 2);
        str += ' ('+percent+'%) - '+ratingFC;
    } document.getElementById('scoreTxt').innerHTML = 'Score: '+score+' | Misses: '+misses+' | Rating: '+str;
}

function floorDecimal(value, decimals) {
    if (decimals < 1) {
        return Math.floor(value);
    }

    var tempMult = 1;
    for (var i = 0; i < decimals; i++) {
        tempMult *= 10;
    }

    var newValue = Math.floor(value * tempMult);
    return newValue / tempMult;
}

function textUpdate() {
    document.getElementById('timer').innerHTML='| '+formatTime(songLength) + ' / ' + formatTime(songPosition/1000)
    scoreTxt_setText();
}

function noteSetting_up(daStrumTime,noteID,isPlayer) {
    unspawnNotes.push({strumTime:daStrumTime,noteData:noteID,mustPress:isPlayer,sustain:false});
}

function noteSetting_up_sustain(daStrumTime,noteID,isPlayer) {
    unspawnNotes.push({strumTime:daStrumTime,noteData:noteID,mustPress:isPlayer,sustain:true});
}

function noteCreate(daStrumTime,noteID,isPlayer,sustain) {
    var note = new Note(daStrumTime,noteID,sustain);
    if (isPlayer==true) {
        note.strumID='playerStrums';
        note.mustPress=true;
        note.missAnim=true;
        note.useCharacter=player;
    } notes_Array.push(note);
}

var allSick=true;
function score_Rating(note) {
    var daRating = judgeNote(ratingsData, Math.abs(note.strumTime - songPosition));
    daRating.hits++;
    totalPlayed++;
    score+=daRating.score;
    totalNotesHit += daRating.ratingMod;
    accuracy = Math.min(1, Math.max(0, totalNotesHit / totalPlayed));
    fullCombo();
    ratings.push(new Rating_Object((allSick==true ? 'allsick' : daRating.name)));
}

function fullCombo() {
    ratingName = ratingStuff[ratingStuff.length-1][0];
    for (var i = 0; i < ratingStuff.length; i++) {
        if (accuracy < ratingStuff[i][1]) {
            ratingName = ratingStuff[i][0];
            break;
        }
    }
    marvelous = ratingsData[0].hits;
    sicks = ratingsData[1].hits;
    goods = ratingsData[2].hits;
    bads = ratingsData[3].hits;
    shits = ratingsData[4].hits;

    allSick=false;
    ratingFC = 'Clear';
    if(misses < 1) {
        if (bads > 0 || shits > 0) ratingFC = 'FC';
        else if (goods > 0) ratingFC = 'GFC';
        else {
            allSick=true;
            if (sicks > 0) ratingFC = 'SFC';
            else if (marvelous > 0) ratingFC = 'PFC';
        }
    }
    else if (misses < 10)
        ratingFC = 'SDCB';
}

function noteJustPress(noteID,strumName) {
    var pressNotes = [];
    var notesStopped = false;
    var sortedNotesList = [];

    notes_Array.forEach((daNote,key) => {
        if (daNote.canBeHit && daNote.mustPress && !daNote.tooLate && !daNote.wasGoodHit && !daNote.isSustainNote) if(daNote.noteID == noteID) sortedNotesList.push(daNote);
    });
    sortedNotesList.sort(sortHitNotes);

    if (sortedNotesList.length > 0) {
        for (let epicNote of sortedNotesList) {
            for (let doubleNote of pressNotes) {
                if (Math.abs(doubleNote.strumTime - epicNote.strumTime) < 1) doubleNote.remove();
                else notesStopped = true;
            }

            // eee jack detection before was not super good
            if (!notesStopped) {
                goodNoteHit(epicNote);
                voice_VolumeChange(1);
                pressNotes.push(epicNote);
            }

        }
    } else playerStrum_playAnim(noteID,anim[mania].chara[noteID]+'-miss',true,false);
}

function goodNoteHit(note) {
    if (note.noteType=='Blammed Notes') {
        let shoot=new Audio('note/notes/Blammed_Notes/shoot.ogg');
        shoot.volume=0.5;
        shoot.play();
        shoot.loop=false;
    }
    health += note.hitHealth;
    health = Math.min(maxhealth, health);

    updateHealthBar(health);

    score_Rating(note);
    playAnim(anim[mania].chara[note.noteID],true,note.useCharacter);
    playerStrum_playAnim(note.noteID,anim[mania].chara[note.noteID],true,false);
    note.remove();
}

function sortHitNotes(a, b) {
    if (a.lowPriority && !b.lowPriority)
        return 1;
    else if (!a.lowPriority && b.lowPriority)
        return -1;

    // Using the JavaScript sort function
    return a.strumTime - b.strumTime;
}

function notePress(noteID,strumName) {
    notes_Array.forEach((value,key) => {
        if (value.canBeHit && !value.tooLate && !value.wasGoodHit && value.noteID==noteID && value.strumID==strumName && value.mustPress && value.isSustainNote==true) {
            playAnim(anim[mania].chara[noteID],true,value.useCharacter);
            voice_VolumeChange(1);
            playerStrum_playAnim(noteID,anim[mania].chara[noteID],true,false);
            value.remove();
        }
    });
}

function noteRelese(noteID) {
    playerStrum_playAnim(noteID,anim[mania].chara[noteID],true,true);
    let notPress=true;
    for(let value in sing_key[mania]) {
        if (sing_key[mania][value].press==true) notPress=false;
    }
}

function create() {
    safeZoneOffset = (ClientPrefs.data.safeFrames / 60) * 1000;

    var rating = new Rating('marvelous');
    rating.score = 400;
    ratingsData.push(rating);

    ratingsData.push(new Rating('sick')); //highest rating goes first

    var rating = new Rating('good');
    rating.ratingMod = 0.67;
    rating.score = 200;
    ratingsData.push(rating);

    var rating = new Rating('bad');
    rating.ratingMod = 0.34;
    rating.score = 100;
    ratingsData.push(rating);

    var rating = new Rating('shit');
    rating.ratingMod = 0;
    rating.score = 50;
    ratingsData.push(rating);
    updateHealthBar(health);

    note_Update();
}

function formatTime(Seconds, ShowMS) {
    if (!(ShowMS == false || ShowMS==true)) ShowMS=false;
	var timeString = parseInt(Seconds / 60) + ":";
	var timeStringHelper = parseInt(Seconds) % 60;
	if (timeStringHelper < 10) timeString += "0";
	timeString += timeStringHelper;
	if (ShowMS) {
		timeString += ".";
		timeStringHelper = parseInt((Seconds - parseInt(Seconds)) * 100);
		if (timeStringHelper < 10) timeString += "0";
		timeString += timeStringHelper;
	}
	return timeString;
}

class Note {
    noteID = 0;
    strumID = 'opponentStrums'
    mustPress = false;
    missAnim = false;
    strumTime=0;
    useCharacter=opponent;
    isSustainNote=false;
    noteType='';
    noteFolder='default';
    new_element=null;
    spawn=false;
    noteHit=false;
    lowPriority=false;
    canBeHit=false;
    tooLate=false;

    tail=[];
    prevNote=this;
    nextNote=this;
    
	earlyHitMult = 1;
	lateHitMult = 1;
    scale={"x":1,"y":1};

	hitHealth = 0.023;
	missHealth = 0.0475;

    constructor(strumTime,noteData,prevNote,sustainNote) {
		if (prevNote == null) prevNote = this;
		this.prevNote = prevNote;
        this.isSustainNote=sustainNote;
        this.strumTime=strumTime;
        this.noteID=noteData;
    }
    set_mustPress(mustPress) {
        this.mustPress=mustPress;
        if (mustPress==true) {
            this.strumID='playerStrums';
            this.missAnim=true;
            this.useCharacter=player;
        }
    }
    set_noteType(noteType) {
        this.noteType=noteType;
        let oldNoteFolder=this.noteFolder;
        switch(noteType) {
            case 'Blammed Notes':
                this.noteFolder='Blammed_Notes';
                break;
            default:
                break;
        }
        if (oldNoteFolder!=this.noteFolder) this.changeTexture(oldNoteFolder);
    }
    update() {
        let element=this.new_element;
        if (this.noteHit==false && this.spawn==true) {
            element.style.transform = 'scale('+this.scale.x+','+this.scale.y+')';

            element.style.left = document.getElementById(this.strumID+this.noteID).getBoundingClientRect().left+'px';
            element.style.top = document.getElementById(this.strumID+this.noteID).getBoundingClientRect().top-((0.45 * (songPosition - this.strumTime) * songSpeed)/inst.playbackRate)+'px';

            if (this.mustPress)
            {
                this.canBeHit = (this.strumTime > songPosition - (safeZoneOffset * this.lateHitMult) &&
                    this.strumTime < songPosition + (safeZoneOffset * this.earlyHitMult));

                if (this.strumTime < songPosition - safeZoneOffset && !this.wasGoodHit)
                    this.tooLate = true;
            } else {
                this.canBeHit = false;

                if (this.strumTime < songPosition + (safeZoneOffset * this.earlyHitMult))
                {
                    if((this.isSustainNote && this.prevNote.wasGoodHit) || this.strumTime <= songPosition)
                        this.wasGoodHit = true;
                }
            }
            
            if ((songPosition - this.strumTime) > noteKillOffset) {
                if (this.mustPress && (this.tooLate || !this.wasGoodHit)) {
                    notes_Array.forEach((daNote,key) => {
                        if (daNote != this && this.mustPress && daNote.noteID == this.noteID && this.isSustainNote == daNote.isSustainNote && Math.abs(this.strumTime - daNote.strumTime) < 1) {
                            daNote.remove();
                        }
                    });
                    
                    misses++;
                    score-=10;
                    totalPlayed++;
    
                    health -= this.missHealth;
                    health = Math.max(minhealth, health);
    
                    updateHealthBar(health);

                    if (this.noteType=='Blammed Notes') {
                        let shoot=new Audio('note/notes/Blammed_Notes/shoot.ogg');
                        shoot.volume=0.5;
                        shoot.play();
                        shoot.loop=false;
                    }
                    ratings.push(new Rating_Object('miss'));
                    if (this.missAnim==true) {
                        playAnim(anim[mania].chara[this.noteID]+'-miss',true,this.useCharacter);
                        voice_VolumeChange(0);
                        //voice.currentTime=inst.currentTime;
                    }
                    this.remove();
                }
            }
            if (this.wasGoodHit==true && this.mustPress==false) {
                playAnim(anim[mania].chara[this.noteID],true,this.useCharacter);
                opponentStrum_playAnim(this.noteID,anim[mania].chara[this.noteID],true,false);
                voice_VolumeChange(1);
                this.remove();
            }
        }
    }
    create() {
        this.new_element = document.createElement('img');
        this.new_element.id = this.strumTime+this.noteID;
        this.new_element.style.position='fixed';
        this.new_element.style.width='108px';
        this.new_element.style.zIndex='950';
        this.new_element.style.left='-1000px';
        this.new_element.loading="lazy";
        if (this.isSustainNote==false) {
            this.new_element.src ='note/Notes/'+this.noteFolder+'/'+anim[mania].strum[(this.noteID%(mania+1))]+'0000.png';
        } else {
            if (this.isSustainNote==true && this.prevNote.new_element != null) {
                this.new_element.src = 'note/Notes/'+this.noteFolder+'/'+anim[mania].strum[(this.noteID%(mania+1))]+' hold end0000.png';
                this.new_element.style.opacity='0.6';
                this.new_element.style.zIndex='940';
                this.scale.x=0.4;
                if (this.prevNote.isSustainNote==true) {
                    this.prevNote.new_element.src = 'note/Notes/'+this.noteFolder+'/'+anim[mania].strum[(this.noteID%(mania+1))]+' hold piece0000.png';
                    this.prevNote.scale.y *= stepCrochet / 100 * 1.05;
                }
				this.earlyHitMult = 0;
            }
        }
    }
    changeTexture(oldFolder) {
        this.new_element.src = this.new_element.src.replace(oldFolder,this.noteFolder);
    }
    add() {
        document.getElementById('notes').appendChild(this.new_element);
    }
    remove() {
        notes_Array.splice(notes_Array.indexOf(this), 1);
        this.new_element.remove();
        this.noteHit=true;
    }
}

function getIndex(arr,value) {
    for(let i in arr) {
        if(arr==value) return i;
    }
    return -1; //値が存在しなかったとき
}

function voice_VolumeChange(volume) {
    //voice.volume=volume;
}