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

    const estudios =
        document.getElementById("tipoEstudio").value;
        console.log("Estudios:", estudios);

    if(estudios.trim()===""){

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

    console.log(datos);

    if(!datos.ok){

        return;

    }

    const texto=

`El presente análisis técnico tiene como objetivo determinar ${datos.caracteristicas.join(", ")}, incluyendo la identificación de alteraciones y reemplazamiento.

Mediante esta evaluación, se garantiza la identificación de especies minerales para las distintas evaluaciones geológicas y posibles estudios geometalúrgicos. Cabe precisar que el material analizado ha sido proporcionado íntegramente por el cliente para los fines de diagnóstico e investigación anteriormente descritos.`;

    document.getElementById(
    "introduccionGenerada"
).textContent =

`A requerimiento del ${document.getElementById("requerimiento").value} 
de la empresa ${document.getElementById("empresa").value}, se han realizado estudios ${document.getElementById("tipoEstudio").value} de la muestra ${document.getElementById("muestra").value}.`;

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

    document.getElementById("txtRequerimiento").textContent = "__________";
    document.getElementById("txtEmpresa").textContent = "__________";
    document.getElementById("txtEstudio").textContent = "__________";
    document.getElementById("txtMuestra").textContent = "__________";

}

function llenarCampo(campo,valor){

    const elemento =
        document.getElementById(campo);

    if(!elemento) return;

    elemento.value=valor;

        switch(campo){

        case "requerimiento":

            document.getElementById("txtRequerimiento").textContent = valor;

        break;

        case "empresa":

            document.getElementById("txtEmpresa").textContent = valor;

        break;

        case "tipoEstudio":

            document.getElementById("txtEstudio").textContent = valor;

        break;

        case "muestra":

            document.getElementById("txtMuestra").textContent = valor;

        break;

    }
    if(campo==="tipoEstudio"){

        actualizarTituloEstudios();

    }

    if(campo==="muestra"){

        actualizarTituloMuestras();

    }

    elemento.classList.add(
        "campo-actualizado"
    );

    setTimeout(()=>{

        elemento.classList.remove(
            "campo-actualizado"
        );

    },800);

    if(campo==="tipoEstudio"){

        generarIntroduccion();

    }

    if(

        document.getElementById("requerimiento").value &&
        document.getElementById("empresa").value &&
        document.getElementById("tipoEstudio").value &&
        document.getElementById("muestra").value

    ){

        generarIntroduccion();

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
.addEventListener("input", generarIntroduccion);
document
.getElementById("tipoEstudio")
.addEventListener("input", actualizarTituloEstudios);

document
.getElementById("muestra")
.addEventListener("input", actualizarTituloMuestras);

document
.getElementById("requerimiento")
.addEventListener("input",generarIntroduccion);

document
.getElementById("empresa")
.addEventListener("input",generarIntroduccion);

document
.getElementById("tipoEstudio")
.addEventListener("input",()=>{

    generarIntroduccion();

});

document
.getElementById("muestra")
.addEventListener("input",generarIntroduccion);