const formulario = document.querySelector("#formulario");  //1
const resultado = document.querySelector("#resultado");    //2
const divPaginacion = document.querySelector("#paginacion");

const registrosPorPag = 40;
let totalPag;

let paginaActual = 1;

let iterador;



window.onload = () => {  //3
    formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {  //4
    e.preventDefault();

    const terminoBusqueda = document.querySelector("#termino").value;

    if(terminoBusqueda === "") {
        mostrarAlerta("Escribe un termino de busqueda");
        return;
    }

    buscarImagenes();
};


function mostrarAlerta(msj) {  //5
    const existeAlerta = document.querySelector(".bg-red-300");

    if(!existeAlerta) {
        const alerta = document.createElement("p");
        alerta.classList.add("bg-red-300", "font-bold", "border-red-400", "text-red-700", "px-4", "py-3", "rounded",  "mt-6", "text-center");
        alerta.innerHTML = `
            <span>${msj}</span>
        `;
        
        formulario.appendChild(alerta);
        
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    } 
};


function buscarImagenes() {  //6
    const termino = document.querySelector("#termino").value;
    const key = "32225746-bff02280b29ea781f665c5012";
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPag}&page=${paginaActual}`;

    fetch(url)
    .then(response => response.json())
    .then(result => {
        totalPag = calcularPag(result.totalHits);
        mostrarImagenes(result.hits);
        console.log(result.hits);
    })
};

function mostrarImagenes(imagenes) {  //7
    
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    };
    
// Iterar sobre el arreglo de imagenes y construir el html:
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4 rounded">
                <div class="bg-white rounded">
                    <img class="w-full rounded" src="${previewURL}">

                    <div class="p-4">
                        <p class="font-bold">${likes} <span class="text-blue-600"> Me Gusta </span> </p>
                        <p class="font-bold">${views} <span class="text-blue-600"> Vistas </span> </p>

                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5"
                            href="${largeImageURL}" target="_blank" rel=""noopener noreferrer"
                        > 
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        
        `;
    });

    //Limpiar el paginador previo:
    while(divPaginacion.firstChild) {
        divPaginacion.removeChild(divPaginacion.firstChild);
    };
    
    //Genera un nuevo paginador:
    imprimirPaginador();

};

function calcularPag(total) {  //8
    return parseInt(Math.ceil(total/registrosPorPag));
    
};

//Generador que registrará la cantidad de elementos de acuerdo a las pags:  //9
function *crearPaginador(total) {
    console.log(total)
    for (let i = 1; i <= total; i++) {
        yield i;
    }
};

function imprimirPaginador() {
    iterador = crearPaginador(totalPag);
    
    while(true) {
        const {value,done} = iterador.next();
        if(done) return;

        //caso contrario genera un boton por cada elemento en el generador:
        const boton = document.createElement("a");
        boton.href = "#";
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add("siguiente", "bg-green-500", "px-4", "py-1", "mr-2", "font-bold", "mb-5", "rounded");

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
            console.log(paginaActual);
            
        }

        divPaginacion.appendChild(boton);

    }
}     