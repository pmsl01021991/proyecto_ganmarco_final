window.addEventListener("DOMContentLoaded", () => {

    const btnIgneas = document.getElementById("btnMarcoIgneas");
    const btnMetamorficas = document.getElementById("btnMarcoMetamorficas");
    const btnSedimentarias = document.getElementById("btnMarcoSedimentarias");

    const wordIgneas = document.getElementById("wordIgneas");
    const wordMetamorficas = document.getElementById("wordMetamorficas");
    const wordSedimentarias = document.getElementById("wordSedimentarias");

    btnIgneas?.addEventListener("click", () => {

        wordIgneas.click();

    });

    btnMetamorficas?.addEventListener("click", () => {

        wordMetamorficas.click();

    });

    btnSedimentarias?.addEventListener("click", () => {

        wordSedimentarias.click();

    });

});