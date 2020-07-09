let recordingTimePreview = document.getElementById("recordingTimePlay");
const btnPlayPause = document.querySelector("#btnPlay-pause");
let intervalo;

let banderaPreviewVideo = false;

function playPreview() {
    previewRecorded.play();
    banderaPreviewVideo = true;
    cargar();
}

function pausePreview() {
    previewRecorded.pause();
    clearInterval(intervalo);
    banderaPreviewVideo = false;
}

btnPlayPause.addEventListener("click", () => {
    if (banderaPreviewVideo === false) {
        playPreview();
        startTimer(recordingTimePreview);
    } else if (banderaPreviewVideo === true) {
        pausePreview();
        pauseTimer();
    }
});

const barraPreviewRecorded = document.getElementById("progreso-paso3");

let divs = barraPreviewRecorded.children;
function pintar(numero) {
    divs[numero].classList.replace("inactive", "active");
}

function borrar() {
    for (let i = 0; i < divs.length; i++) {
        divs[i].classList.replace("active", "inactive");
    }
}

let index = 0;
function cargar() {
    intervalo = setInterval(() => {
        if (previewRecorded.ended) {
            clearInterval(intervalo);
            borrar();
            index = 0;
        } else if (index > 16) {
            index = 0;
            borrar();
            pintar(index);
            index++;
        } else {
            pintar(index);
            index++;
        }
    }, 200);
}
