let textoCaracteristicas = "";
let temporizadorBusqueda;

function normalizarTipoEstudio(texto){

    texto = texto
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[.,;:¡!¿?]/g," ");

    // Corregir nombres separados
    texto = texto
        .replace(/PETRO GRAFICOS?/g,"PETROGRAFICOS")
        .replace(/PEDRO GRAFICOS?/g,"PETROGRAFICOS")
        .replace(/FOTOGRAFICOS?/g,"PETROGRAFICOS")

        .replace(/MINERA GRAFICOS?/g,"MINERAGRAFICOS")
        .replace(/MINERO GRAFICOS?/g,"MINERAGRAFICOS")
        .replace(/NINERA GRAFICOS?/g,"MINERAGRAFICOS")
        .replace(/MUERAGRAFICOS/g,"MINERAGRAFICOS")

        .replace(/PETRO MINERA GRAFICOS?/g,"PETROMINERAGRAFICOS");

    return texto.trim();

}

async function guardarIntroduccion() {

    const datos = {

        requerimiento:
            document.getElementById("requerimiento").value,

        empresa:
            document.getElementById("empresa").value,

        tipoEstudio:
            document.getElementById("tipoEstudio").value,

        muestra:
            document.getElementById("muestra").value,

        textoIntroduccion:
            document.getElementById("introduccionGenerada").textContent

    };

    const respuesta = await fetch(
        "http://localhost:3000/guardar-introduccion",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datos)
        }
    );

    const resultado = await respuesta.json();

    if(resultado.ok){

        alert("Informe guardado correctamente");

    }else{

        alert("Error al guardar");

    }

}

async function generarIntroduccion(){

     console.log("ENTRÓ A generarIntroduccion");

    const estudios = normalizarTipoEstudio(
            document.getElementById("tipoEstudio").value
        );
        console.log("Estudios:", estudios);

    if(estudios.trim()===""){

        textoCaracteristicas = "";

        document.getElementById(
            "introduccionGenerada"
        ).textContent="";

        return;

    }

    const respuesta =
        await fetch(
            "http://localhost:3000/obtener-caracteristicas",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    tipoEstudio:estudios

                })

            }
        );        

    const datos =
        await respuesta.json();
    console.log("CARACTERISTICAS:", datos.caracteristicas);

    console.log(datos);

    if(!datos.ok){

        return;

    }

    textoCaracteristicas = datos.caracteristicas.join("\n\n");

actualizarIntroduccionGenerada();

    }

function actualizarIntroduccionGenerada(){

    console.log("ACTUALIZANDO INTRODUCCIÓN");

    const requerimiento =
    document.getElementById("requerimiento").value;

    const empresa =
    document.getElementById("empresa").value;

    const estudios =
    document.getElementById("tipoEstudio").value;

    const muestra =
    document.getElementById("muestra").value;

    document.getElementById("introduccionGenerada").textContent =

`A requerimiento de ${requerimiento} de la empresa ${empresa}, se han realizado estudios ${estudios} de la muestra de ${muestra}.

${textoCaracteristicas}`;

}

function limpiarFormulario(){

    camposValidos.forEach(campo=>{

        const elemento =
        document.getElementById(campo);

        if(elemento){

            elemento.value="";

        }

    });

    document.getElementById(
        "introduccionGenerada"
    ).textContent="";

    document.getElementById("tituloEstudios").textContent =
        "ESTUDIOS";

    document.getElementById("tituloMuestras").textContent =
        "MUESTRAS";

    

}

function llenarCampo(campo, valor){

    console.log("LLENAR CAMPO:", campo, valor);

    const elemento = document.getElementById(campo);

    if(!elemento) return;

    elemento.value = valor;

    if(campo === "tipoEstudio"){

        actualizarTituloEstudios();

    }

    if(campo === "muestra"){

        actualizarTituloMuestras();

    }

    elemento.classList.add("campo-actualizado");

    setTimeout(() => {

        elemento.classList.remove("campo-actualizado");

    }, 800);

    if(

        document.getElementById("requerimiento").value.trim() !== "" &&
        document.getElementById("empresa").value.trim() !== "" &&
        document.getElementById("tipoEstudio").value.trim() !== "" &&
        document.getElementById("muestra").value.trim() !== ""

    ){

        generarIntroduccion();

    }else{

        document.getElementById("introduccionGenerada").textContent = "";

    }

}

function actualizarTituloEstudios(){

    const valor =
        document.getElementById("tipoEstudio").value;

    document.getElementById("tituloEstudios").textContent =
        valor.trim() === ""
            ? "ESTUDIOS"
            : "ESTUDIOS " + valor.toUpperCase();

}

function actualizarTituloMuestras(){

    const valor =
        document.getElementById("muestra").value;

    document.getElementById("tituloMuestras").textContent =
        valor.trim() === ""
            ? "MUESTRAS"
            : "MUESTRAS " + valor.toUpperCase();

}

document
    .getElementById("btnGuardar")
    .addEventListener("click", guardarIntroduccion);
document
.getElementById("tipoEstudio")
.addEventListener("input", actualizarTituloEstudios);

document
.getElementById("muestra")
.addEventListener("input", actualizarTituloMuestras);

document
.getElementById("requerimiento")
.addEventListener("input", () => {

    actualizarIntroduccionGenerada();

});

document
.getElementById("empresa")
.addEventListener("input", () => {

    actualizarIntroduccionGenerada();

});

document
.getElementById("tipoEstudio")
.addEventListener("input", () => {

    actualizarIntroduccionGenerada();
    actualizarTituloEstudios();

    clearTimeout(temporizadorBusqueda);

    temporizadorBusqueda = setTimeout(() => {

        generarIntroduccion();

    }, 500);

});

document
.getElementById("muestra")
.addEventListener("input", () => {

    actualizarTituloMuestras();
    actualizarIntroduccionGenerada();

});