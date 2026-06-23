const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "geopilot",
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