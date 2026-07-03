window.addEventListener("DOMContentLoaded",()=>{

    configurarWord(
        "btnMarcoIgneas",
        "wordIgneas"
    );

    configurarWord(
        "btnMarcoMetamorficas",
        "wordMetamorficas"
    );

    configurarWord(
        "btnMarcoSedimentarias",
        "wordSedimentarias"
    );

});

function configurarWord(idBoton,idInput){

    const boton=document.getElementById(idBoton);

    const input=document.getElementById(idInput);

    const visor=document.getElementById("visorWord");

    boton.addEventListener("click",()=>{

        input.click();

    });

    input.addEventListener("change",async function(){

        if(this.files.length===0) return;

        const archivo=this.files[0];

        const arrayBuffer=
            await archivo.arrayBuffer();

        const resultado = await mammoth.convertToHtml(
            {
                arrayBuffer
            },
            {
                convertImage: mammoth.images.imgElement(function(image){

                    return image.read("base64").then(function(imageBuffer){

                        return {

                            src: "data:" + image.contentType + ";base64," + imageBuffer

                        };

                    });

                })

            }
        );

        visor.innerHTML=`

            <div class="wordContenido">

                ${resultado.value}

            </div>

        `;

    });

}