function frameRate(){
    let fps = 0;
    let frameCount = 0;
    let startTime;
    let endTime;
    startTime = new Date().getTime();
    function animationLoop(){
        frameCount ++;
        endTime = new Date().getTime();
        if(endTime - startTime >= 1000) {
            fps = frameCount;
            frameCount = 0;
            startTime = new Date().getTime();
        }
        requestAnimationFrame(animationLoop);
        if (fps > ClientPrefs.data.framerate) fps = ClientPrefs.data.framerate;
        document.getElementById('frameRate').innerHTML='FPS : '+fps;
        if (fps <= ClientPrefs.data.framerate / 2) document.getElementById('frameRate').style.color='#f00'; else document.getElementById('frameRate').style.color='#000';
    }
    animationLoop();
}