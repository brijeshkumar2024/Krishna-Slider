var radius = 240; // Radius of the carousel
var autoRotate = true; // Enable auto-rotation
var rotateSpeed = -60; // Rotation speed (seconds per 360 degrees)
var imgWidth = 220, imgHeight = 300; // Image dimensions

var bgMusicURL = null; // Set to null to disable background music
var bgMusicControls = true;

setTimeout(init, 1000);

var odrag = document.getElementById("drag-container");
var ospin = document.getElementById("spin-container");
var aImg = ospin.getElementsByTagName("img");
var aVid = ospin.getElementsByTagName("video");
var aEle = [...aImg, ...aVid]; // Merge images and videos

ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

document.getElementById("ground").style.width = radius * 3 + "px";
document.getElementById("ground").style.height = radius * 3 + "px";

function init(delayTime) {
    aEle.forEach((ele, i) => {
        ele.style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
        ele.style.transition = "transform 1s";
        ele.style.transitionDelay = `${delayTime || (aEle.length - i) / 4}s`;
    });
}

function applyTransform(obj) {
    tY = Math.max(0, Math.min(180, tY)); // Restrict rotation angle
    obj.style.transform = `rotateX(${-tY}deg) rotateY(${tX}deg)`;
}

function playSpin(yes) {
    ospin.style.animationPlayState = yes ? "running" : "paused";
}
function adjustForMobile() {
  if (window.innerWidth < 768) {
      radius = 500; // Increase depth to bring images closer
      imgWidth = 200; // Larger image size
      imgHeight = 280;
      ospin.style.width = imgWidth + "px";
      ospin.style.height = imgHeight + "px";
      document.getElementById("ground").style.width = radius * 3 + "px";
      document.getElementById("ground").style.height = radius * 3 + "px";
      
      aEle.forEach((ele, i) => {
          ele.style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
      });

      init(1);
  }
}

// Run this on load and resize
adjustForMobile();
window.addEventListener("resize", adjustForMobile);

var sX, sY, desX = 0, desY = 0, tX = 0, tY = 10;

if (autoRotate) {
    ospin.style.animation = `${rotateSpeed > 0 ? "spin" : "spinRevert"} ${Math.abs(rotateSpeed)}s infinite linear`;
}

if (bgMusicURL) {
    let audio = document.createElement("audio");
    audio.src = bgMusicURL;
    audio.loop = true;
    if (bgMusicControls) audio.controls = true;
    document.body.appendChild(audio);
}


document.addEventListener("pointerdown", (e) => {
    clearInterval(odrag.timer);
    sX = e.clientX;
    sY = e.clientY;

    function onPointerMove(e) {
        desX = (e.clientX - sX) * 0.1;
        desY = (e.clientY - sY) * 0.1;
        tX += desX;
        tY += desY;
        applyTransform(odrag);
        sX = e.clientX;
        sY = e.clientY;
    }

    function onPointerUp() {
        odrag.timer = setInterval(() => {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTransform(odrag);
            playSpin(false);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(odrag.timer);
                playSpin(true);
            }
        }, 17);
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
    }

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
});

document.addEventListener("wheel", (e) => {
    radius += e.deltaY / 20;
    init(1);
    e.preventDefault();
}, { passive: false });
