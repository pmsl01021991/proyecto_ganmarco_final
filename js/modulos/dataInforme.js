const archivos = {
    minerales: null,
    igneas: null,
    metamorficas: null,
    sedimentarias: null,
    alteraciones: null
};

function iniciarDataInforme() {

    Object.keys(archivos).forEach(id => {

        const input = document.getElementById(id);

        if (!input) return;

        input.addEventListener("change", function () {

            if (this.files.length === 0) return;

            archivos[id] = this.files[0];

            actualizarListaArchivos();

        });

    });

}

function toggleDataMenu() {

    const menu = document.getElementById("menuData");
    const flecha = document.getElementById("flechaData");

    menu.classList.toggle("activo");

    if (flecha) {

        flecha.classList.toggle("fa-chevron-down");
        flecha.classList.toggle("fa-chevron-up");

    }

}

function abrirArchivo(id) {

    const input = document.getElementById(id);

    if (!input) return;

    input.click();

}

function actualizarListaArchivos() {

    const panel = document.getElementById("vistaDataInforme");

    if(panel){

        panel.style.display = "block";

    }

    const lista = document.getElementById("listaArchivos");

    if (!lista) return;

    lista.innerHTML = "";

    let cantidad = 0;

    Object.entries(archivos).forEach(([id, archivo]) => {

        if (archivo) {

            cantidad++;

            lista.innerHTML += `

                <div class="archivo-item">

                    <i class="fa-solid fa-circle-check"></i>

                    <span>${archivo.name}</span>

                </div>

            `;

        }

    });

    if (cantidad === 0) {

        lista.innerHTML = "<p>No hay archivos cargados.</p>";

    }

}

window.toggleDataMenu = toggleDataMenu;
window.abrirArchivo = abrirArchivo;
window.iniciarDataInforme = iniciarDataInforme;