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
            "Indique el nombre del solicitante.",

        empresa:
            "Indique la empresa.",

        tipoEstudio:
            "Indique los estudios realizados.",

        muestra:
            "Indique la muestra."

    };

    return preguntas[
        campos[indiceCampo]
    ];

}

app.post("/procesar-voz", async (req,res)=>{

    const textoOriginal = req.body.texto || "";

    const texto = normalizarTexto(textoOriginal);

    let comando = null;
    let respuestaVoz = "";

    if(

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

        const { tipoEstudio } = req.body;

        const texto = tipoEstudio.toUpperCase();

        let caracteristicas = [];

        if (texto.includes("PETROGRAFICOS")) {

            const [rows] = await db.execute(
                "SELECT caracteristicas FROM tipos_estudio WHERE nombre='PETROGRAFICOS'"
            );

            if (rows.length > 0)
                caracteristicas.push(rows[0].caracteristicas);

        }

        if (texto.includes("MINERAGRAFICOS")) {

            const [rows] = await db.execute(
                "SELECT caracteristicas FROM tipos_estudio WHERE nombre='MINERAGRAFICOS'"
            );

            if (rows.length > 0)
                caracteristicas.push(rows[0].caracteristicas);

        }

        if (texto.includes("PETROMINERAGRAFICOS")) {

            const [rows] = await db.execute(
                "SELECT caracteristicas FROM tipos_estudio WHERE nombre='PETROMINERAGRAFICOS'"
            );

            if (rows.length > 0)
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