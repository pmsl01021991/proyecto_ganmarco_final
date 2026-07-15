function mostrarVista(vista){

    //==========================
    // VISTAS
    //==========================

    const vistaPresentacion =
    document.getElementById("vistaPresentacion");

    const vistaContenido =
    document.getElementById("vistaContenido");

    const vistaIntroduccion =
    document.getElementById("vistaIntroduccion");

    const vistaCaracterizacion =
    document.getElementById("vistaCaracterizacion");

    const vistaMarco =
    document.getElementById("vistaMarco");

    const vistaMicroscopica =
    document.getElementById("vistaMicroscopica");

    //==========================
    // PANELES IZQUIERDOS
    //==========================

    const panelIntroduccion =
    document.getElementById("panelIntroduccionIzquierda");

    const panelCaracterizacion =
    document.getElementById("panelCaracterizacionIzquierda");

    const panelMarco =
    document.getElementById("panelMarcoBotones");


    //==========================
    // OCULTAR TODAS LAS VISTAS
    //==========================

    [
        vistaPresentacion,
        vistaContenido,
        vistaIntroduccion,
        vistaCaracterizacion,
        vistaMarco,
        vistaMicroscopica
    ].forEach(vistaActual=>{

        if(vistaActual)
            vistaActual.style.display="none";

    });


    //==========================
    // OCULTAR PANELES
    //==========================

    if(panelIntroduccion)
        panelIntroduccion.style.display="none";

    if(panelCaracterizacion)
        panelCaracterizacion.style.display="none";

    if(panelMarco)
        panelMarco.style.display="none";


    //==========================
    // MOSTRAR VISTA
    //==========================

    switch(vista){

        case "presentacion":

            vistaPresentacion.style.display="block";

        break;


        case "contenido":

            vistaContenido.style.display="block";

        break;


        case "introduccion":

            vistaIntroduccion.style.display="block";
            panelIntroduccion.style.display="block";

        break;


        case "caracterizacion":

            vistaCaracterizacion.style.display="block";
            panelCaracterizacion.style.display="block";

        break;


        case "marco":

            vistaMarco.style.display="block";
            panelMarco.style.display="block";

        break;


        case "microscopica":

            vistaMicroscopica.style.display="block";

        break;

    }

        setTimeout(() => {

        igualarAlturaIndice();

    }, 0);

}

function igualarAlturaIndice(){

    const indice =
    document.querySelector(".indice");

    const vistaVisible =
    document.querySelector(".right-column > div[style*='display: block'] .card");

    if(!indice || !vistaVisible) return;

    indice.style.height =
    vistaVisible.offsetHeight + "px";

}