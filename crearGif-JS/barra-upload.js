const barraCargando = document.querySelector("#progreso-paso4");
let intervaloUpload;
let divsUpload = barraCargando.children;

function cargarBarraUpload() {
    let i = 0;
    if (i > 1) {
        i = 0;
    }
    function pintar(numero) {
        divsUpload[numero].classList.replace("inactive", "active");
    }

    function borrar() {
        for (let j = 0; j < divsUpload.length; j++) {
            divsUpload[j].classList.replace("active", "inactive");
        }
    }

    intervaloUpload = setInterval(() => {
        if (i > 16) {
            i = 0;
            borrar();
            pintar(i);
            i++;
        } else {
            pintar(i);
            i++;
        }
    }, 200);
}
