
const recordingTime = document.querySelector("#recordingTime");
let myRecordingTime = null;

let time = 0;
let running = 0;
let myInterval;

async function startTimer(element) {
    if (running == 0) {
        running = 1;
        increment(element);
    }
}

function pauseTimer() {
    running = 0;
    clearInterval(myInterval);
}

function resetTimer(element) {
    running = 0;
    time = 0;
    element.innerHTML = "00:00:00:00";
}

function stopTimer(element) {
    clearInterval(myInterval);
    resetTimer(element);
}

async function increment(element) {
    if (running == 1) {
        myInterval = setInterval(() => {
            time++;
            let min = Math.floor(time / 10 / 60);
            let sec = Math.floor((time / 10) % 60);
            let hora = Math.floor(time / 10 / 60 / 60);
            let centesimaSec = time % 10;

            if (min < 10) {
                min = "0" + min;
            }

            if (sec < 10) {
                sec = "0" + sec;
            }

            if (hora < 10) {
                hora = "0" + hora;
            }

            myRecordingTime =
                hora + ":" + min + ":" + sec + ":" + "0" + centesimaSec;
            element.innerHTML = myRecordingTime;
        }, 100);
    }
}
