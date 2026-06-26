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

async function generarIntroduccion(){

    const estudios =
        document.getElementById("tipoEstudio").value;

    if(estudios.trim()===""){

        document.getElementById(
            "textoIntroduccion"
        ).value="";

        return;

    }

    const respuesta =
        await fetch(
            "/obtener-caracteristicas",
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

    if(!datos.ok){

        return;

    }

    const texto=

`El presente análisis técnico tiene como objetivo determinar ${datos.caracteristicas.join(", ")}, incluyendo la identificación de alteraciones y reemplazamiento.

Mediante esta evaluación, se garantiza la identificación de especies minerales para las distintas evaluaciones geológicas y posibles estudios geometalúrgicos. Cabe precisar que el material analizado ha sido proporcionado íntegramente por el cliente para los fines de diagnóstico e investigación anteriormente descritos.`;

    document.getElementById(
        "textoIntroduccion"
    ).value=texto;

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

function limpiarFormulario(){

    camposValidos.forEach(campo=>{

        const elemento =
        document.getElementById(campo);

        if(elemento){

            elemento.value="";

        }

    });

    document.getElementById(
        "textoIntroduccion"
    ).value="";

}

function llenarCampo(campo,valor){

    const elemento =
        document.getElementById(campo);

    if(!elemento) return;

    elemento.value=valor;

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

}

async function revisarComando(){

    try{

        const res=
        await fetch("/ultimo-comando");

        const comando=
        await res.json();

        if(!comando) return;

        if(comando.fecha===ultimaFecha)
            return;

        ultimaFecha=
        comando.fecha;

        document.getElementById(
            "ultimoDictado"
        ).textContent=
        comando.textoOriginal || "---";

        document.getElementById(
            "estadoIA"
        ).textContent=
        comando.respuestaVoz || "";

        if(

            comando.accion==="abrir_formulario"

        ){

            limpiarFormulario();

            document
            .getElementById(
                "requerimiento"
            )
            .focus();

        }

        else if(

            comando.accion==="llenar"

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
    500
);