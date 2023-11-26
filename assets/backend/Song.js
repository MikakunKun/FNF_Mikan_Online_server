var start=false;
var songList=[
    'rush-hour',
    'best-girl',
    'brain-rot-alt',
    'arrest',
    'w00f',
    'new-state'
];
var nowSongName='rush-hour';//'best-girl';//'brain-rot-alt';
var inst = new Audio();
var voice = new Audio();
var voiceFind = false;

function startTheSong() {
    if (created_Song==true) return;
    endingSong=false;
    notes_Array.forEach((value,key) => {
        value.remove();
    });
    notes_Array=[];
    unspawnNotes=[];
    misses=0;
    score=0;
    totalPlayed=0;
    totalNotesHit=0.0;
    marvelous = 0;
    sicks = 0;
    goods = 0;
    bads = 0;
    shits = 0;

    start=true;
    songPosition=0;
    nowSongName=songList[5];
    generateSong(nowSongName);
}

var created_Song=false;
var bpm = 100.0;
var crochet = 0; // beats in milliseconds
var stepCrochet = 0; // steps in milliseconds
var mania=3;

function generateSong(songName) {
    var songData={"notes":[]};
    switch(songName) {
        case 'brain-rot-alt':
            songData=brain_rot_alt_song;
            break;
        case 'best-girl':
            songData=best_girl_song;
            break;
        case 'rush-hour':
            songData=rush_hour_notes;
            break;
        case 'arrest':
            songData=arrest_chart;
            break;
        case 'w00f':
            songData=w00f_song;
            break;
        case 'new-state':
            songData=new_state_mania;
            break;
    }
    songSpeed=songData.speed;
    inst = new Audio('song/'+songName+'/Inst.ogg');
    inst.pause();
    inst.loop=false;

    inst.addEventListener('loadedmetadata', function() {
        songLength = inst.duration;
    });

    inst.addEventListener('ended', function() {
        endSong();
    });

    if (songData.needsVoices==true) {
        try {
            voice = new Audio('song/'+songName+'/Voices.ogg');
            voice.pause();
            voice.loop=false;
            voiceFind=true;
        } catch(e) {}
    } else voiceFind=false;
    if (songName=='w00f') {
        inst.playbackRate=1.25;
        voice.playbackRate=1.25;
    }

    bpm=songData.bpm;
    crochet = ((60 / bpm) * 1000);
    stepCrochet = crochet / 4;

    noteGenerate(songData.notes);

    inst.play();
    if (voiceFind==true) {
        voice.play();
        voice.currentTime=inst.currentTime;
    }
	noteKillOffset = Math.max(stepCrochet, 350 / songSpeed);
    created_Song=true;
}

function noteGenerate(songData) {
    for (let section of songData) {
        //alert(JSON.stringify(section));
        for (let songNotes of section.sectionNotes) {
            let daStrumTime = songNotes[0];
            let daNoteData = Math.floor(songNotes[1] % (mania+1));
            let gottaHitNote = section.mustHitSection;

            if (songNotes[3]==null) songNotes[3]='';
            if (songNotes[1] > mania) gottaHitNote = !section.mustHitSection;

            let oldNote = unspawnNotes.length > 0 ? unspawnNotes[unspawnNotes.length - 1] : null;
  
            let swagNote = new Note(daStrumTime, daNoteData, oldNote, false);
            swagNote.create();
			swagNote.set_mustPress(gottaHitNote);
			swagNote.sustainLength = songNotes[2];
            swagNote.set_noteType(songNotes[3]);
  
            let susLength = swagNote.sustainLength;
            susLength = susLength / stepCrochet;
            unspawnNotes.push(swagNote);
  
            let floorSus = Math.floor(susLength);
            if (floorSus > 0) {
                for (let susNote = 0; susNote <= floorSus + 1; susNote++) {
                    oldNote = unspawnNotes[unspawnNotes.length - 1];
  
                    let sustainNote = new Note(daStrumTime + (stepCrochet * susNote), daNoteData, oldNote, true);
                    sustainNote.create();
                    sustainNote.set_mustPress(gottaHitNote);
                    sustainNote.set_noteType(swagNote.noteType);
					swagNote.tail.push(sustainNote);
                    unspawnNotes.push(sustainNote);
                }
            }
        }
    }
}