let ultimaFecha = 0;

const camposValidos = [

    "requerimiento",
    "empresa",
    "tipoEstudio",
    "muestra"

];


async function revisarComando(){

    try{

        const res=
        await fetch("/ultimo-comando");

        const comando=
        await res.json();

        if(!comando) return;

        if(comando.fecha===ultimaFecha){
            return;

        }

        ultimaFecha = comando.fecha;

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