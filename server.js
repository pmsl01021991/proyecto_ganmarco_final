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
            "Indique el nombre de la empresa.",

        tipoEstudio:
            "Indique los estudios realizados.",

        muestra:
            "muestra."

    };

    return preguntas[campos[indiceCampo]];
}

app.post("/procesar-voz", async (req,res)=>{

    const textoOriginal =
        req.body.texto || "";

    const texto =
        normalizarTexto(textoOriginal);

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

        respuestaVoz =
            siguientePregunta();

    }

    else if(modoConversacion){

        const campoActual =
            campos[indiceCampo];

        comando = {

            accion:"llenar",

            campo:campoActual,

            valor:textoOriginal

        };

        indiceCampo++;

        if(indiceCampo >= campos.length){

            modoConversacion = false;

            respuestaVoz =
                "Introducción completada.";

        }
        else{

            respuestaVoz =
                siguientePregunta();

        }

    }

    ultimoComando = {

        ...comando,

        textoOriginal,

        respuestaVoz,

        fecha:Date.now()

    };

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

app.listen(3000, () => {
    console.log("Servidor GeoPilot listo");
    console.log("http://localhost:3000");
});