const body = document.body;
const headerCounter = document.querySelector("#header-counter");
//containers
const ventanaInicio = document.querySelector("#crear-guifos");
const ventanaCaptura = document.querySelector("#crear-guifos-paso-1");
const ventanaVistaPrevia = document.querySelector("#crear-guifos-paso-3");
const ventanaSubiendo = document.querySelector("#crear-guifos-paso-4");
const ventanaGifSubidoOk = document.querySelector("#crear-guifos-paso-5");
const sectionMisGuifos = document.querySelector("#misGuifos");

//ventana 1
const btnPaso1Cancelar = document.querySelector("#btn-cancelar");
const btnPaso1Comenzar = document.querySelector("#btn-comenzar");

//ventana2
const previewVideo = document.querySelector("#preview-video");
const tituloPaso1 = document.querySelector("#titulo-Paso1");
const btnCapturar = document.querySelector("#btn-capturar");

const contenedorStopRecording = document.querySelector("#stopRecording");
const btnStopRecording = document.querySelector("#btn-stop");

const previewGifBig = document.querySelector("#previewGif");
const previewRecorded = document.querySelector("#preview-recorded");

const paso3Actions = document.querySelector("#recorded-gif");
const btnRepetirCaptura = document.querySelector("#btn-repetirCaptura");
const formUploadGif = document.querySelector("#form-subir-guifo");
const btnSubirGuifo = document.querySelector("#btn-subirGuifo");

//gifSubiendo
const btnCancelarUpload = document.querySelector("#cancelar-upload");

//GifSubidoOk
const gifPreviewSmall = document.querySelector("#previewGif-Uploaded");
const btnCopyUrl = document.querySelector("#copiar-enlace-gruifo-btn");
const btnDownloadGif = document.querySelector("#descargar-guifo-btn");
const btnListoGuifoCreado = document.querySelector("#btn-listo-guifoCreado");

const grillaMisGuifos = document.querySelector("#crear-mis-guifos");

const apiKey = "5JaMj27gUqbTFKVrsbTOc9rzA9R9U5uT";
let stream;
let recorder;
let recorderVideo;
let blob;

const sailorNight = localStorage.getItem("sailorNight");

function activarLightTheme() {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    let imglogo = document.querySelector(".navBar__logo");
    imglogo.src = "/assets/gifOF_logo.png";

    localStorage.setItem("sailorNight", "off");
}

function activarDarkTheme() {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    let imglogo = document.querySelector(".navBar__logo");
    imglogo.src = "/assets/gifOF_logo_dark.png";

    localStorage.setItem("sailorNight", "on");
}

//consultar theme en localStorage
if (sailorNight === "on") {
    activarDarkTheme();
}

async function sumarContador() {
    const contadorVisitas = localStorage.getItem("visitas");
    let content = Number(contadorVisitas);
    setInterval(() => {
        headerCounter.innerHTML = content++;
        localStorage.setItem("visitas", headerCounter.innerHTML);
    }, 500);
}

sumarContador();

//mostrar mis guifos creados al cargar la pagina
const localGuifos = localStorage.getItem("mis-guifos");
let listaGuifosCreados = JSON.parse(localGuifos);
if (listaGuifosCreados === null) {
} else {
    for (let i = 0; i < listaGuifosCreados.length; i++) {
        async function mostrarGuifosCreado() {
            let elemento = listaGuifosCreados[i];

            let pedido = await fetch(
                `http://api.giphy.com/v1/gifs/${elemento}?api_key=${apiKey}`
            );
            let respuesta = await pedido.json();
            return respuesta;
        }
        mostrarGuifosCreado().then((gifData) => {
            let gifImg = gifData.data.images.original.url;
            let gifUrl = gifData.data.url;
            let content = `<div class="gridContainer__gifBox">
                 <a class='gridContainer__url'href="${gifUrl}" target="_blanl">
                 <img class="gridContainer__gif" src="${gifImg}" alt="Mi Guifo">        
                        </a>
                                </div>
                                `;
            grillaMisGuifos.innerHTML += content;
        });
    }
}

//funcion para detener el stream de paso 1. Apagar la camara
function stopStreamVideo(videoElem) {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(function (track) {
        track.stop();
    });

    videoElem.srcObject = null;
}

async function previewCamera() {
    await navigator.mediaDevices
        .getUserMedia({ audio: false, video: { height: { max: 480 } } })
        .then(function (camera) {
            previewVideo.srcObject = camera;
            previewVideo.play();
            stream = camera;
        })
        .catch(function (error) {
            alert("Hubo un problema para accediendo a la camara");
            console.error(error);
        });
}

function stopRecordingCallback() {
    recorder.stopRecording();
    recorderVideo.stopRecording();
    recorderVideo.getDataURL((url) => {
        previewRecorded.src = url;
    });

    blob = recorder.getBlob();
    let gifUrl = URL.createObjectURL(blob);
    gifPreviewSmall.setAttribute("src", gifUrl);
    return blob;
}

function captureCamera(camera) {
    recorder = RecordRTC(camera, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
    });

    recorderVideo = RecordRTC(camera, {
        type: "audio/webm",
        quality: 10,
        width: 360,
        hidden: 240,
        frameRate: 1,
    });

    recorder.startRecording();
    recorderVideo.startRecording();
}

previewRecorded.addEventListener("ended", () => {
    stopTimer(previewRecorded);
    banderaPreviewVideo = false;
});

function repetirCaptura() {
    previewRecorded.src = "";
    recorder.destroy();
    recorder = null;
    gifPreviewSmall.src = "";
}

let controller = new AbortController();

async function subirGif() {
    let form = new FormData();
    form.append("file", blob, "miGif.gif");
    try {
        let pedido = await fetch(
            "http://upload.giphy.com/v1/gifs?api_key=5JaMj27gUqbTFKVrsbTOc9rzA9R9U5uT",
            {
                method: "POST",
                body: form,
                signal: controller.signal,
            }
        );
        if (!pedido.ok) {
            throw new Error("Error en Fetch POST" + pedido.status);
        }
        if (pedido.ok) {
            clearInterval(intervaloUpload);
            estiladoUploadOk();
        }
        let respuesta = await pedido.json();
        return respuesta;
    } catch (error) {
        clearInterval(intervaloUpload);
        console.log(error.message);
    }
}

function guardarEnLocal(objeto) {
    let items = localStorage.getItem("mis-guifos");
    let miLista = [];
    if (items != null) {
        miLista = JSON.parse(items);
    }
    miLista.push(objeto.data.id);
    localStorage.setItem("mis-guifos", JSON.stringify(miLista));
}

async function fetchGuifoCreado() {
    try {
        let items = localStorage.getItem("mis-guifos");
        let lista = JSON.parse(items);
        let lastItem = lista.length - 1;
        let pedido = await fetch(
            `http://api.giphy.com/v1/gifs/${lista[lastItem]}?api_key=${apiKey}`
        );
        if (!pedido.ok) {
            throw new Error("Ocurrió un error fetch GET gif creado");
        }
        let respuesta = await pedido.json();
        return respuesta;
    } catch (error) {
        console.error(error);
        alert("Error para mostrar tu gif creado =(");
    }
}

function crearGuifoNuevo(gifData) {
    let gifImg = gifData.data.images.original.url;
    let gifUrl = gifData.data.url;
    let content = `<div class="gridContainer__gifBox">
             <a class='gridContainer__url'href="${gifUrl}" target="_blanl">
             <img class="gridContainer__gif" src="${gifImg}" alt="Mi Guifo">        
                    </a>
                            </div>
                            `;
    grillaMisGuifos.innerHTML += content;

    //evento para btn copiar url
    btnCopyUrl.addEventListener("click", () => {
        const inputUrl = document.querySelector("#inputUrl");
        let gifUrl = gifData.data.url;
        inputUrl.value = gifUrl;
        inputUrl.classList.remove("ocultame");
        inputUrl.select();
        document.execCommand("copy");
        alert("url copiada: " + gifUrl);
    });
}

async function subirYguardar() {
    try {
        let objeto = await subirGif();
        if (objeto === undefined) {
        } else {
            guardarEnLocal(objeto);
            let dataGif = await fetchGuifoCreado();
            crearGuifoNuevo(dataGif);
        }
        borrar(); //funcion para volver a 0 la barra de carga
    } catch (error) {
        console.log(error.message);
    }
}

function estiladoCapturar() {
    tituloPaso1.innerText = "Capturando tu Guifo";
    btnCapturar.classList.add("ocultame");
    contenedorStopRecording.classList.remove("ocultame");
}

function estiladoUploadOk() {
    ventanaSubiendo.classList.add("ocultame");
    ventanaGifSubidoOk.classList.remove("ocultame");
}

//eventos
btnPaso1Cancelar.addEventListener("click", () => {
    ventanaInicio.classList.add("ocultame");
});

btnPaso1Comenzar.addEventListener("click", function () {
    ventanaInicio.classList.add("ocultame");
    sectionMisGuifos.classList.add("ocultame");
    tituloPaso1.innerText = "Un Checkeo Antes de Empezar";
    ventanaCaptura.classList.remove("ocultame");
    btnCapturar.classList.remove("ocultame");
    previewCamera();
});

btnCapturar.addEventListener("click", () => {
    startTimer(recordingTime);
    estiladoCapturar();
    captureCamera(stream);
});

btnStopRecording.addEventListener("click", () => {
    stopTimer(recordingTime);
    ventanaCaptura.classList.add("ocultame");
    contenedorStopRecording.classList.add("ocultame");
    ventanaVistaPrevia.classList.remove("ocultame");
    stopRecordingCallback();
    stopStreamVideo(previewVideo);
});

btnRepetirCaptura.addEventListener("click", () => {
    repetirCaptura();
    stopTimer(recordingTimePreview); //el timer siempre empieza en 0
    //barra reproduccion vuelve a 0
    borrar();
    index = 0;
    ventanaVistaPrevia.classList.add("ocultame");
    tituloPaso1.innerText = "Un Checkeo Antes de Empezar";
    ventanaCaptura.classList.remove("ocultame");
    btnCapturar.classList.remove("ocultame");
    previewCamera();
});

btnSubirGuifo.addEventListener("click", async () => {
    stopTimer(recordingTimePreview); //el timer siempre empieza en 0
    //barra reproduccion vuelve a 0
    borrar();
    index = 0;
    ventanaVistaPrevia.classList.add("ocultame");
    ventanaSubiendo.classList.remove("ocultame");
    cargarBarraUpload();
    await subirYguardar();
    sectionMisGuifos.classList.remove("ocultame");
});

btnCancelarUpload.addEventListener("click", () => {
    controller.abort(); //cancelar fetch
    alert("Upload Cancelado =(");
    repetirCaptura();
    ventanaSubiendo.classList.add("ocultame");
    ventanaInicio.classList.remove("ocultame");
    grillaMisGuifos.classList.remove("ocultame");
});

btnDownloadGif.addEventListener("click", () => {
    return recorder.save();
});

btnListoGuifoCreado.addEventListener("click", () => {
    ventanaGifSubidoOk.classList.add("ocultame");
    inputUrl.classList.add("ocultame");
    ventanaInicio.classList.remove("ocultame");
    repetirCaptura();
});
