let kecleons_index=5;
let kecleons_maxIndex=0;
function kecleons_idle() {
    kecleons_index--;
    document.getElementById('kecleons').src='bg/treasure town/kecleons/kecleons'+kecleons_index+'.png';
    if (kecleons_index==kecleons_maxIndex) kecleons_index=5;
    setTimeout(() => {
        kecleons_idle();
    }, 90);
}
