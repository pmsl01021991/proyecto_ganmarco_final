function seleccionarImagen(numero){

    const input = document.getElementById(`file${numero}`);

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