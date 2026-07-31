function mostrarPanelArchivos(){

    const panel =
    document.getElementById("vistaDataInforme");

    if(panel){

        panel.style.display = "block";

    }

}

document.addEventListener("click",(e)=>{

    switch(e.target.id){

        case "btnDividir":

            dividirColumna();

        break;

        case "btnUnir":

            unirColumna();

        break;

    }

});

function dividirColumna(){

    const grupo2 =
    document.getElementById("grupo2");

    const grupoInferior =
    document.getElementById("grupoInferior");

    if(!grupo2 || !grupoInferior) return;

    grupo2.style.display = "table-cell";

    grupoInferior.colSpan = 1;

}