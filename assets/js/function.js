window.onload = function() {
    frameRate();
    //week1
    onLoad_Player();
    onLoad_Opponent();
    
    // Note
    create();
};

function animIndex(anim,index) {
    let _index='0000';
    _index+=index;
    return anim+_index.substr(-4);
}