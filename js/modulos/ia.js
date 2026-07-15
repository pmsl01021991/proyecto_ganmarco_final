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
        await fetch("http://localhost:3000/ultimo-comando");

        const comando=
        await res.json();

        if(!comando) return;

        if(comando.fecha===ultimaFecha){
            return;

        }

        ultimaFecha = comando.fecha;

        const ultimoDictado = document.getElementById("ultimoDictado");

        if (ultimoDictado) {

            ultimoDictado.textContent =
                comando.textoOriginal || "---";

        }

        const estadoIA = document.getElementById("estadoIA");

        if (estadoIA) {

            estadoIA.textContent =
                comando.respuestaVoz || "";

        }

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