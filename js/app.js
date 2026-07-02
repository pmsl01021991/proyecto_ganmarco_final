async function cargarComponente(contenedor, archivo){

    const respuesta = await fetch(`componentes/${archivo}`);

    const html = await respuesta.text();

    document.getElementById(contenedor).innerHTML = html;

}

window.addEventListener("DOMContentLoaded", async () => {

    await cargarComponente("headerContainer", "header.html");

    await cargarComponente("heroContainer", "hero.html");

    await cargarComponente("footerContainer", "footer.html");

    await cargarComponente("panelBusqueda", "panelBusqueda.html");

});




