var totalPlayed=0;
var totalNotesHit=0.0;

class Rating_Object {
    rating=null;
    x=0;
    y=0;
    alpha=1;
    moveY=5;
    moveX=0;
    constructor(ratingName) {
        this.rating = document.createElement('img');
        this.rating.style.position='fixed';
        this.rating.style.zIndex='60';
        this.x=player.x+200;
        this.y=player.y;
        this.moveY=getRandomFloat(3.5,4.5);
        this.moveX=getRandomFloat(0,1);
        this.rating.style.left=this.x+'px';
        this.rating.style.top=this.y+'px';
        this.rating.style.transform = 'scale(0.7)';
        this.rating.loading="lazy";
        this.rating.src = 'ratings/'+ratingName+'.png';
        document.getElementById('other').appendChild(this.rating);
    }
    update() {
        this.alpha-=0.015;
        this.x+=this.moveX;
        this.y-=this.moveY;
        this.rating.style.left=this.x+'px';
        this.rating.style.top=this.y+'px';
        this.moveY-=0.1;
        this.rating.style.opacity=this.alpha;
        if (this.alpha<0) {
            this.rating.remove();
            ratings.splice(ratings.indexOf(this), 1)
        }
    }
}

class Rating {
	name = '';
	image = '';
    hits=0;
	hitWindow = 0; //ms
	ratingMod = 1.0;
	score = 350;
    constructor(name) {
		this.name = name;
		this.image = name;
		this.hitWindow = 0;
		var window = name + 'Window';
        try {
            this.hitWindow = ClientPrefs.data[window];
        } catch(e) {console.log(e);}
    }
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
function judgeNote(arr, diff=0) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (diff <= arr[i].hitWindow) {
            return arr[i];
        }
    }
    return arr[arr.length - 1];
}