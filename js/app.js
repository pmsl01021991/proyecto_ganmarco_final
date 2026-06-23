function seleccionarImagen(numero){

    const input =
    document.getElementById(`file${numero}`);

    if(input){
        input.click();
    }
}

for(let i=1;i<=4;i++){

    const archivoInput =
    document.getElementById(`file${i}`);

    if(!archivoInput) continue;

    archivoInput.addEventListener(
        "change",
        function(e){

            const archivo =
            e.target.files[0];

            if(!archivo) return;

            const lector =
            new FileReader();

            lector.onload =
            function(event){

                const imagen =
                document.getElementById(`img${i}`);

                if(imagen){

                    imagen.src =
                    event.target.result;

                }

            };

            lector.readAsDataURL(
                archivo
            );

        }
    );

}

document
    .getElementById("btnGuardar")
    .addEventListener("click", guardarIntroduccion);

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
            document.getElementById("textoIntroduccion").value

    };

    const respuesta = await fetch(
        "/guardar-introduccion",
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

function generarIntroduccion(){

    const estudios =
        document.getElementById("tipoEstudio")
        .value
        .toLowerCase();

    let caracteristicas = [];

    if(estudios.includes("petrograficos")){

        caracteristicas.push(
            "los minerales no metálicos, tamaño de los minerales, su abundancia porcentual, los parámetros texturales y las asociaciones mineralógicas"
        );

    }

    if(estudios.includes("mineragraficos")){

        caracteristicas.push(
            "los minerales metálicos"
        );

    }

    if(estudios.includes("petromineragraficos")){

        caracteristicas.push(
            "los minerales metálicos y no metálicos, tamaño de los minerales, abundancia porcentual, parámetros texturales y asociaciones mineralógicas"
        );

    }

    if(caracteristicas.length === 0){

        document.getElementById(
            "textoIntroduccion"
        ).value = "";

        return;
    }

    const texto =

`El presente análisis técnico tiene como objetivo determinar ${caracteristicas.join(", ")}, incluyendo la identificación de alteraciones y reemplazamiento.

Mediante esta evaluación, se garantiza la identificación de especies minerales para las distintas evaluaciones geológicas y posibles estudios geometalurgicos. Cabe precisar que el material analizado ha sido proporcionado íntegramente por el cliente para los fines de diagnóstico e investigación anteriormente descritos.`;

    document.getElementById(
        "textoIntroduccion"
    ).value = texto;

}

document
.getElementById("tipoEstudio")
.addEventListener("input", generarIntroduccion);

let ultimaFecha = 0;

const camposValidos = [

    "requerimiento",
    "empresa",
    "tipoEstudio",
    "muestra"

];

function llenarCampo(campo,valor){

    const elemento =
        document.getElementById(campo);

    if(!elemento) return;

    elemento.value = valor;

    if(campo === "tipoEstudio"){

        generarIntroduccion();

    }

}

async function revisarComando(){

    try{

        const res =
            await fetch("/ultimo-comando");

        const comando =
            await res.json();

        if(!comando) return;

        if(comando.fecha === ultimaFecha)
            return;

        ultimaFecha =
            comando.fecha;

        if(
            comando.accion ===
            "llenar"
        ){

            llenarCampo(
                comando.campo,
                comando.valor
            );

        }

    }
    catch(error){

        console.log(error);

    }

}

setInterval(
    revisarComando,
    1000
);