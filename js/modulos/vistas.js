function mostrarVista(vista){

    const vistaIntroduccion =
    document.getElementById("vistaIntroduccion");

    const vistaCaracterizacion =
    document.getElementById("vistaCaracterizacion");

    const vistaMicroscopica =
    document.getElementById("vistaMicroscopica");

    vistaMicroscopica.style.display="none";

    const panelIntroduccion =
    document.getElementById("panelIntroduccionIzquierda");

    const panelCaracterizacion =
    document.getElementById("panelCaracterizacionIzquierda");

    const panelMarco =
    document.getElementById("panelMarcoBotones");

    vistaIntroduccion.style.display="none";
    vistaCaracterizacion.style.display="none";

    panelIntroduccion.style.display="none";
    panelCaracterizacion.style.display="none";

    panelIntroduccion.style.display="none";
    panelCaracterizacion.style.display="none";

    if(vistaMarco)
        vistaMarco.style.display="none";

    panelIntroduccion.style.display="none";
    panelCaracterizacion.style.display="none";

    if(panelMarco)
        panelMarco.style.display="none";

    if(vista==="introduccion"){

        vistaIntroduccion.style.display="block";
        panelIntroduccion.style.display="block";

    }

    if(vista==="caracterizacion"){

        vistaCaracterizacion.style.display="block";
        panelCaracterizacion.style.display="block";

    }

    // MARCO METODOLÓGICO
    if(vista==="marco"){

        if(vistaMarco)
            vistaMarco.style.display="block";

        if(panelMarco)
            panelMarco.style.display="block";

    }

    if(vista==="microscopica"){

        vistaMicroscopica.style.display="block";

    }

}