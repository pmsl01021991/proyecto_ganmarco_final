import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

const campos = [
    "requerimiento",
    "empresa",
    "tipoEstudio",
    "muestra"
];

let modoHistoriaCompleta = false;

function textoANumeros(texto){

    const mapa = {
        cero:"0",
        uno:"1",
        una:"1",
        dos:"2",
        tres:"3",
        cuatro:"4",
        cinco:"5",
        seis:"6",
        siete:"7",
        ocho:"8",
        nueve:"9",
        diez:"10"
    };

    texto = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");

    const palabras = texto.split(/\s+/);

    let resultado = "";

    for(const palabra of palabras){

        if(mapa[palabra]){
            resultado += mapa[palabra] + " ";
        }
        else{
            resultado += palabra + " ";
        }

    }

    return resultado.trim();

}

let modoConversacion = false;
let indiceCampo = 0;

let ultimoComando = null;

function normalizarTexto(texto){

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "estudio_petrografico",
  waitForConnections: true,
  connectionLimit: 10
});

app.post("/guardar-introduccion", async (req, res) => {

    try {

        const {
            requerimiento,
            empresa,
            tipoEstudio,
            muestra,
            textoIntroduccion
        } = req.body;

        await db.execute(
            `
            INSERT INTO introduccion_informe
            (
                requerimiento,
                empresa,
                tipoEstudio,
                muestra,
                textoIntroduccion
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                requerimiento,
                empresa,
                tipoEstudio,
                muestra,
                textoIntroduccion
            ]
        );

        res.json({
            ok:true
        });

    } catch(error){

        console.error(error);

        res.status(500).json({
            ok:false,
            error:error.message
        });

    }

});

app.get("/buscar-introduccion/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const [rows] = await db.execute(
            `
            SELECT *
            FROM introduccion_informe
            WHERE id = ?
            `,
            [id]
        );

        if(rows.length === 0){

            return res.json({
                ok:false
            });

        }

        res.json({
            ok:true,
            informe:rows[0]
        });

    } catch(error){

        console.error(error);

        res.status(500).json({
            ok:false,
            error:error.message
        });

    }

});

function siguientePregunta(){

    const preguntas = {

        requerimiento:
            "nombre",

        empresa:
            "empresa",

        tipoEstudio:
            "estudios realizados.",

        muestra:
            "muestra."

    };

    return preguntas[
        campos[indiceCampo]
    ];

}

app.post("/procesar-voz", async (req,res)=>{

    const textoOriginal = req.body.texto || "";
    let texto = normalizarTexto(textoOriginal);
    texto = texto
        .replace(/petro graficos/g, "petrograficos")
        .replace(/petro grafico/g, "petrografico")
        .replace(/minera graficos/g, "mineragraficos")
        .replace(/minera grafico/g, "mineragrafico")
        .replace(/petro minera graficos/g, "petromineragraficos")
        .replace(/petro minera grafico/g, "petromineragrafico");

    let comando = null;
    let respuestaVoz = "";

    console.log("RECIBIDO:", textoOriginal);
    console.log("INDICE:", indiceCampo);

    if(
        texto.includes("informe") ||
        texto.includes("nuevo informe") ||
        texto.includes("nuevo in forme") ||
        texto.includes("nueva introduccion") ||
        texto.includes("iniciar introduccion")

    ){

        modoConversacion = true;

        indiceCampo = 0;

        comando = {
            accion:"abrir_formulario"
        };

        respuestaVoz = siguientePregunta();

    }

    else if(

        texto.includes("terminar introduccion") ||
        texto.includes("finalizar introduccion")

    ){

        modoConversacion = false;

        respuestaVoz =
            "Introducción finalizada.";

        comando = {

            accion:"modo_finalizado"

        };

    }

    else if(modoConversacion){

        const campoActual =
            campos[indiceCampo];

        let valorFinal = textoOriginal;

        if(campoActual==="tipoEstudio"){

            valorFinal =
                textoANumeros(textoOriginal);

        }

        comando={

            accion:"llenar",

            campo:campoActual,

            valor:valorFinal

        };

        indiceCampo++;

        if(indiceCampo>=campos.length){

            modoConversacion=false;

            respuestaVoz=
                "Introducción completada.";

        }
        else{

            respuestaVoz=
                siguientePregunta();

        }

    }

    ultimoComando={

        ...comando,

        textoOriginal,

        respuestaVoz,

        fecha:Date.now()

    };

    console.log(ultimoComando);

    console.log("COMANDO FINAL:", comando);
    console.log("INDICE FINAL:", indiceCampo);

    res.json({

        ok:true,

        comando:ultimoComando,

        respuestaVoz

    });

});

app.get("/ultimo-comando",(req,res)=>{

    res.json(
        ultimoComando ||
        {accion:"ninguno"}
    );

});

app.post("/obtener-caracteristicas", async (req, res) => {

    try {

        let { tipoEstudio } = req.body;

        let texto = tipoEstudio
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[.,]/g, "");
            texto = texto
            .replace(/[¡!¿?:;]/g, "")
            .replace(/\s+/g, " ")
            .trim();

        texto = texto
            .replace(/PETRO GRAFICO/g, "PETROGRAFICOS")
            .replace(/PEDRO GRAFICO/g, "PETROGRAFICOS")
            .replace(/PETRO GRAFICOS/g, "PETROGRAFICOS")
            .replace(/PETROGRAFICO/g, "PETROGRAFICOS")
            .replace(/PETROGRAFICOS/g, "PETROGRAFICOS")
            .replace(/PEDROGRAFICOS/g, "PETROGRAFICOS")
            .replace(/PEDROGRAFICO/g, "PETROGRAFICOS")
            .replace(/FOTOGRAFICOS/g, "PETROGRAFICOS")
            .replace(/FOTOGRAFICO/g, "PETROGRAFICOS")
            .replace(/MUERAGRAFICOS/g, "MINERAGRAFICOS")
            .replace(/MUERAGRAFICO/g, "MINERAGRAFICOS")

            .replace(/MINERA GRAFICO/g, "MINERAGRAFICOS")
            .replace(/MINERA GRAFICOS/g, "MINERAGRAFICOS")
            .replace(/MINERAGRAFICO/g, "MINERAGRAFICOS")
            .replace(/MINERAGRAFICOS/g, "MINERAGRAFICOS")
            .replace(/MINERAGRAFICOS/g, "MINERAGRAFICOS")
            .replace(/MINERAGRAFICO/g, "MINERAGRAFICOS")

            .replace(/PETRO MINERA GRAFICO/g, "PETROMINERAGRAFICOS")
            .replace(/PETRO MINERA GRAFICOS/g, "PETROMINERAGRAFICOS")
            .replace(/PETROMINERAGRAFICO/g, "PETROMINERAGRAFICOS")
            .replace(/PETROMINERAGRAFICOS/g, "PETROMINERAGRAFICOS");

        let caracteristicas = [];

        if (texto.includes("PETROGRAFICOS")) {

            const [rows] = await db.execute(
                "SELECT caracteristicas FROM tipos_estudio WHERE nombre='PETROGRAFICOS'"
            );

            if (rows.length)
                caracteristicas.push(rows[0].caracteristicas);

        }

        if (texto.includes("MINERAGRAFICOS")) {

            const [rows] = await db.execute(
                "SELECT caracteristicas FROM tipos_estudio WHERE nombre='MINERAGRAFICOS'"
            );

            if (rows.length)
                caracteristicas.push(rows[0].caracteristicas);

        }

        if (texto.includes("PETROMINERAGRAFICOS")) {

            const [rows] = await db.execute(
                "SELECT caracteristicas FROM tipos_estudio WHERE nombre='PETROMINERAGRAFICOS'"
            );

            if (rows.length)
                caracteristicas.push(rows[0].caracteristicas);

        }

        res.json({
            ok: true,
            caracteristicas
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false
        });

    }

});

app.listen(3000, () => {
    console.log("Servidor GeoPilot listo");
    console.log("http://localhost:3000");
});