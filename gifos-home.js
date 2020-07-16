const body = document.body;
const headerCounter = document.querySelector("#header-counter");

//secciones
const sectionSearch = document.querySelector(".result");
const sectionSuggestion = document.querySelector(".suggestion");
const sectionTrending = document.querySelector(".trending");
const sectionMisGuifos = document.querySelector("#misGuifos");

//botones theme
const btnTheme = document.querySelector(".theme__btn");
const themesOptions = document.querySelector(".theme__box");
const btnLightTheme = document.querySelector(".theme__sailorDay");
const btnDarkTheme = document.querySelector(".theme__sailorNight");

//elementos busqueda
const searchBar = document.querySelector(".search__input");
const btnSearch = document.querySelector(".search__btn");
const resultSuggestion = document.querySelector(".search__bigBox");

const imgLogo = document.querySelector("#img-logo");
const logoLupa = document.querySelector("#logo-lupa");

//relategTag
const relatedTagContainer = document.querySelector(".search__relatedTags");
const relatedTagSearch1 = document.querySelector("#relatedTag1");
const relatedTagSearch2 = document.querySelector("#relatedTag2");
const relatedTagSearch3 = document.querySelector("#relatedTag3");

//contenedores de grilla
const gifSugerenciaContainer = document.querySelector("#grilla-sugerencia");
const grillaTendencias = document.querySelector("#grilla-tendencia");
const grillaBusqueda = document.querySelector("#grilla-busqueda");
const grillaMisGuifosHome = document.querySelector("#home-mis-guifos");

const apiKey = "5JaMj27gUqbTFKVrsbTOc9rzA9R9U5uT";

//Estado del theme en localStorage
const sailorNight = localStorage.getItem("sailorNight");

//bandera Theme
let themeNight;

function activarLightTheme() {
    themeNight = false;
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    imgLogo.src = "/assets/gifOF_logo.png";
    logoLupa.setAttribute("src", "/assets/lupa_inactive.svg");

    localStorage.setItem("sailorNight", "off");
}

function activarDarkTheme() {
    themeNight = true;
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    imgLogo.src = "/assets/gifOF_logo_dark.png";
    logoLupa.setAttribute("src", "/assets/lupa_dark.svg");

    localStorage.setItem("sailorNight", "on");
}

//consultar el estado del theme en localStorage
if (sailorNight === "on") {
    activarDarkTheme();
}

btnTheme.addEventListener("click", () => {
    themesOptions.classList.toggle("ocultame");
});

btnLightTheme.addEventListener("click", activarLightTheme);
btnDarkTheme.addEventListener("click", activarDarkTheme);

async function sumarContador() {
    const contadorVisitas = localStorage.getItem("visitas");
    let content = Number(contadorVisitas);
    setInterval(() => {
        headerCounter.innerHTML = content++;
        localStorage.setItem("visitas", headerCounter.innerHTML);
    }, 500);
}

sumarContador();

async function crearElementosBusqueda(busqueda, contenedor) {
    try {
        let elemento = busqueda.data;
        contenedor.innerText = "";
        for (let i = 0; i < elemento.length; i++) {
            const resultadoGifDiv = document.createElement("div");
            resultadoGifDiv.classList.add("gridContainer__gifBox");
            const resultadoUrl = document.createElement("a");
            resultadoUrl.classList.add("gridContainer__url");
            resultadoUrl.setAttribute("href", elemento[i].url);
            resultadoUrl.setAttribute("target", "_blank");
            const resultadoGif = document.createElement("img");
            resultadoGif.classList.add("gridContainer__gif");
            resultadoGif.setAttribute("src", elemento[i].images.original.url);
            resultadoGif.setAttribute("alt", elemento[i].title);
            const resultadoBanner = document.createElement("div");
            resultadoBanner.classList.add("gridContainer__bottom");
            const resultadoBannerP = document.createElement("p");
            resultadoBannerP.classList.add("gridContainer__hashtag");

            let tags = elemento[i].title;
            let splitTags = tags.split(" ");

            resultadoBannerP.innerText = "";
            splitTags.forEach((tag) => {
                let content = tag;
                resultadoBannerP.innerText += `#${content} `;
            });

            resultadoBanner.appendChild(resultadoBannerP);
            resultadoUrl.appendChild(resultadoGif);
            resultadoGifDiv.appendChild(resultadoUrl);
            resultadoGifDiv.appendChild(resultadoBanner);
            contenedor.appendChild(resultadoGifDiv);

            //condicion para agrandar el espacio ocupado
            let gifWidth = Number(elemento[i].images.original.width);
            let gifHeight = Number(elemento[i].images.original.height);
            if (gifWidth / gifHeight > 1.6) {
                resultadoGifDiv.classList.add("containerPlus");
            }

            resultadoGifDiv.addEventListener("mouseenter", () => {
                resultadoBanner.style.opacity = "100";
            });
            resultadoGifDiv.addEventListener("mouseleave", () => {
                resultadoBanner.style.opacity = "0";
            });
        }
    } catch (error) {
        console.log(error.message);
    }
}

async function autocompleteBusqueda(keyword) {
    try {
        let pedido = await fetch(
            `https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&q=${keyword}&limit=24`
        );
        if (!pedido.ok) {
            throw new Error(
                "Error en fetch AutoComplete Endpoint" + pedido.status
            );
        }
        let respuesta = await pedido.json();
        return respuesta;
    } catch (error) {
        console.log(error);
    }
}

async function crearAutocomplete(keyword) {
    try {
        let mostrarTerms = await autocompleteBusqueda(keyword);
        if (mostrarTerms.data.length === 0) {
        } else {
            const resultadoSugerencia = document.querySelectorAll(
                ".search__boxSuggestion"
            );
            resultadoSugerencia[0].innerHTML = mostrarTerms.data[0].name;
            resultadoSugerencia[1].innerHTML = mostrarTerms.data[1].name;
            resultadoSugerencia[2].innerHTML = mostrarTerms.data[2].name;
        }
    } catch (error) {
        console.log(error);
    }
}

async function obtenerRelatedTags(keyword) {
    try {
        let pedido = await fetch(
            `https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&q=${keyword}`
        );
        if (!pedido.ok) {
            throw new Error(
                "Error en fetch Search Related Endpoint" + pedido.status
            );
        }
        let respuesta = await pedido.json();
        return respuesta;
    } catch (error) {
        console.log(error);
    }
}

async function obtenerBusquedaGif(keyword) {
    try {
        let pedido = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${keyword}&limit=24`
        );
        if (!pedido.ok) {
            throw new Error("Error en fetch Search Endpoint" + pedido.status);
        }
        let respuesta = await pedido.json();
        return respuesta;
    } catch (error) {
        console.log(error);
    }
}

async function mostrarRelatedTagSearch(busqueda) {
    let tag = await obtenerRelatedTags(busqueda);
    let tagsData = tag.data;
    relatedTagContainer.innerHTML = "";
    tagsData.forEach((tag) => {
        let box = document.createElement("div");
        box.classList.add("search__tag");
        let hashtag = document.createElement("p");
        hashtag.innerText = `#${tag.name}`;
        box.appendChild(hashtag);
        relatedTagContainer.appendChild(box);

        box.addEventListener("click", () => {
            let opcion = tag.name;
            searchBar.value = opcion;
            submitBusqueda();
        });
    });
}

function searchActive() {
    btnSearch.classList.remove("search__btn");
    btnSearch.classList.add("search__btn--enable");
    if (themeNight === true) {
        logoLupa.setAttribute("src", "/assets/lupa_light.svg");
    } else {
        logoLupa.setAttribute("src", "/assets/lupa.svg");
    }
    resultSuggestion.classList.remove("ocultame");
}

function searchEnable() {
    btnSearch.classList.remove("search__btn--enable");
    btnSearch.classList.add("search__btn");
    if (themeNight === true) {
        logoLupa.setAttribute("src", "/assets/lupa_dark.svg");
    } else {
        logoLupa.setAttribute("src", "/assets/lupa_inactive.svg");
    }
    resultSuggestion.classList.add("ocultame");
    relatedTagContainer.classList.add("ocultame");
}

function estiladoSubmit() {
    //ocultar opciones sugeridas
    resultSuggestion.classList.add("ocultame");
    //mostrar seccion resultados
    sectionSearch.classList.remove("ocultame");
    //ocultar seccion sugerencias
    sectionSuggestion.classList.add("ocultame");
    //ocultar seccion tendencias
    sectionTrending.classList.add("ocultame");
    //mostrar tagsSugerencia
    relatedTagContainer.classList.remove("ocultame");
    //actualizar valor de busqueda
    const textoBanner = document.querySelector(".result__title");
    textoBanner.innerHTML =
        "Resultado de la busqueda: " + '"' + searchBar.value + '"';
}
async function inputBusqueda() {
    let keyword = searchBar.value;
    let autocomplete = await crearAutocomplete(keyword);

    btnSearch.classList.remove("search__btn");
    btnSearch.classList.add("search__btn--enable");
    searchActive();
    resultSuggestion.classList.remove("ocultame");
}

const container404 = document.querySelector("#container-not-found");
let banderaError = false;
async function submitBusqueda() {
    try {
        estiladoSubmit();
        let keyword = searchBar.value;
        mostrarRelatedTagSearch(keyword);
        let llamarApi = await obtenerBusquedaGif(keyword);

        if (llamarApi.data.length === 0) {
            container404.classList.remove("ocultame");
            grillaBusqueda.classList.add("ocultame");
            banderaError = true;
        } else {
            let mostrarGif = await crearElementosBusqueda(
                llamarApi,
                grillaBusqueda
            );
            if (banderaError === true) {
                container404.classList.add("ocultame");
                grillaBusqueda.classList.remove("ocultame");
                banderaError = false;
            }
        }
    } catch (error) {
        console.log("Error en submit Busqueda" + error.message);
    }
}

const btnSubmit = document.querySelector(".search__btn");
btnSubmit.addEventListener("click", submitBusqueda);

let opcionResultado1 = document.querySelector("#resultado-sugerencia1");
opcionResultado1.addEventListener("click", () => {
    let opcion = opcionResultado1.innerText;
    searchBar.value = opcion;
    submitBusqueda();
});

let opcionResultado2 = document.querySelector("#resultado-sugerencia2");
opcionResultado2.addEventListener("click", () => {
    let opcion = opcionResultado2.innerText;
    searchBar.value = opcion;
    submitBusqueda();
});

let opcionResultado3 = document.querySelector("#resultado-sugerencia3");
opcionResultado3.addEventListener("click", () => {
    let opcion = opcionResultado3.innerText;
    searchBar.value = opcion;
    submitBusqueda();
});

//Seccion Sugerencias
async function obtenerSugerencia(sugerencia) {
    try {
        let respuesta = await fetch(
            `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${sugerencia}`
        );

        if (!respuesta.ok) {
            console.log(
                "Ocurrio un error en Fetch Trending Endpoint " +
                    respuesta.status
            );
        }
        let data = await respuesta.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

function crearSugerencia(busqueda, term) {
    let elemento = busqueda.data;
    const gifContainer = document.createElement("div");
    gifContainer.classList.add("suggestionGifContainer");
    const gifHeader = document.createElement("div");
    gifHeader.classList.add("suggestionGifContainer__header");
    const gifHashtags = document.createElement("p");
    gifHashtags.classList.add("suggestionGifContainer__hashtag");
    const btnClose = document.createElement("button");
    btnClose.classList.add("suggestionGifContainer__close");
    const imgClose = document.createElement("img");
    imgClose.setAttribute("src", "/assets/button_close.svg");
    imgClose.setAttribute("alt", "Close btn");
    const gifImg = document.createElement("img");
    gifImg.classList.add("suggestionGifContainer__gif");
    const btnMore = document.createElement("div");
    btnMore.classList.add("suggestionGifContainer__more");
    const moreUrl = document.createElement("a");
    moreUrl.innerText = "Ver mas...";

    //hashtags
    let tags = elemento.title;
    let splitTags = tags.split(" ");
    gifHashtags.innerText = "";
    splitTags.forEach((tag) => {
        let content = tag;
        gifHashtags.innerText += `#${content} `;
    });
    //gif
    gifImg.setAttribute("src", elemento.images.original.url);
    gifImg.setAttribute("alt", elemento.title);

    //boton ver mas con url
    btnMore.appendChild(moreUrl);

    btnClose.appendChild(imgClose);
    //header + hashtags + btncerrar
    gifHeader.appendChild(gifHashtags);
    gifHeader.appendChild(btnClose);

    gifContainer.appendChild(gifHeader);
    gifContainer.appendChild(gifImg);
    gifContainer.appendChild(btnMore);

    gifSugerenciaContainer.appendChild(gifContainer);

    imgClose.addEventListener("click", () => {
        gifContainer.classList.add("ocultame");
    });

    moreUrl.addEventListener("click", () => {
        searchBar.value = term;
        submitBusqueda();
    });
}

let listaSugerencias = [
    "the office",
    "rick and morty",
    "friends tv",
    "bobs burger",
];
async function mostrarSugerencia() {
    for (let i = 0; i < 4; i++) {
        let llamarFetch = await obtenerSugerencia(listaSugerencias[i]);
        crearSugerencia(llamarFetch, listaSugerencias[i]);
    }
}

mostrarSugerencia();

//seccion Trending
async function obtenerTrendingGif() {
    try {
        let pedido = await fetch(
            `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=24`
        );
        if (!pedido.ok) {
            throw new Error("Error en fetch Trending Endpoint" + pedido.status);
        }
        let respuesta = await pedido.json();
        return respuesta;
    } catch (error) {
        console.log(error);
    }
}
obtenerTrendingGif().then((respuesta) => {
    crearElementosBusqueda(respuesta, grillaTendencias);
});

searchBar.addEventListener("keyup", () => {
    let valor = searchBar.value;
    if (valor.length === 0 || valor.length === -1) {
        searchEnable();
    } else {
        inputBusqueda();
    }
});

//seccion mis guifos
const localGuifos = localStorage.getItem("mis-guifos");
let listaGuifosCreados = JSON.parse(localGuifos);
if (listaGuifosCreados === null) {
} else {
    for (let i = 0; i < listaGuifosCreados.length; i++) {
        async function mostrarGuifosCreado() {
            try {
                let elemento = listaGuifosCreados[i];
                let pedido = await fetch(
                    `https://api.giphy.com/v1/gifs/${elemento}?api_key=${apiKey}`
                );
                if(!pedido.ok){
                    throw new Error('Error en fetch request mi guifo creado' + pedido.status)
                }
                let respuesta = await pedido.json();
                return respuesta;
            }catch(error){
                console.log(error.message)
            }
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
            grillaMisGuifosHome.innerHTML += content;
        });
    }
}

//mostrar seccion mis Guifos
const misGuifosBtn = document.querySelector("#misGuifosBtn");
misGuifosBtn.addEventListener("click", function () {
    sectionMisGuifos.classList.remove("ocultame");
    document.getElementById("search").classList.add("ocultame");
    sectionSuggestion.classList.add("ocultame");
    sectionTrending.classList.add("ocultame");
});
