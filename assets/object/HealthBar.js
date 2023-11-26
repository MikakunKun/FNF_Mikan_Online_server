var minhealth=0;
var health=1;
var maxhealth=2;

function updateHealthBar(value) {
    var healthBarBG = document.querySelector(".healthBarBG");
    var healthImg = document.querySelector(".health-bar-img");
    var healthBar = document.getElementById("healthBar");
    var _healthBar = document.getElementById("_healthBar");

    var imgWidth = healthImg.clientWidth;
    var imgHeight = healthImg.clientHeight;

    _healthBar.style.width = imgWidth  + "px";
    _healthBar.style.height = imgHeight + "px";

    value=maxhealth-value;
    var percentage = (value - minhealth) / (maxhealth - minhealth) * 100;
    healthBar.style.width = (percentage * imgWidth / 100)  + "px";
    healthBar.style.height = imgHeight + "px";
}

function healthBar_Percent() {
    return (health - minhealth) / (maxhealth - minhealth) * 100;
}

function animation_HealthBar() {
}