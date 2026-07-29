import sqlite3 from "sqlite3";

const db = new sqlite3.Database("estudio_petrografico.db", (err) => {
    if (err) {
        console.error("Error al crear la base:", err.message);
        return;
    }

    console.log("Base SQLite creada correctamente.");
});

db.serialize(() => {

    // ============================
    // TABLA introduccion_informe
    // ============================

    db.run(`
        CREATE TABLE IF NOT EXISTS introduccion_informe (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            requerimiento TEXT,

            empresa TEXT,

            tipoEstudio TEXT,

            muestra TEXT,

            textoIntroduccion TEXT,

            fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP

        )
    `);

    // ============================
    // TABLA tipos_estudio
    // ============================

    db.run(`
        CREATE TABLE IF NOT EXISTS tipos_estudio (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nombre TEXT UNIQUE,

            caracteristicas TEXT

        )
    `);

    // ============================
    // Limpiar datos iniciales
    // ============================

    db.run("DELETE FROM tipos_estudio");

    // ============================
    // Insertar PETROGRAFICOS
    // ============================

    db.run(
        `
        INSERT INTO tipos_estudio
        (
            nombre,
            caracteristicas
        )
        VALUES
        (?,?)
        `,
        [
            "PETROGRAFICOS",

`El presente estudio petrográfico tiene como finalidad caracterizar los minerales no metálicos de la muestra.

Para ello, se desarrollará una descripción macroscópica y microscópica que abarca la asociación mineral, los tipos de textura, las alteraciones, los reemplazamientos, así como el tamaño y la abundancia de los minerales.

Además, se incluirá la síntesis microscópica, una tabla de alteraciones, la distribución, los estilos de mineralización y la descripción de las microfotografías.`
        ]
    );

    // ============================
    // Insertar MINERAGRAFICOS
    // ============================

    db.run(
        `
        INSERT INTO tipos_estudio
        (
            nombre,
            caracteristicas
        )
        VALUES
        (?,?)
        `,
        [
            "MINERAGRAFICOS",

`El presente estudio mineragráfico tiene como finalidad caracterizar los minerales metálicos de la muestra.

Para ello, se desarrollará una descripción que abarca la asociación mineral, los tipos de textura, los reemplazamientos, así como el tamaño y la abundancia de los minerales.

Además, se incluirán estilos de mineralización, secuencia paragenética y la descripción de las microfotografías.`
        ]
    );

    // ============================
    // Insertar PETROMINERAGRAFICOS
    // ============================

    db.run(
        `
        INSERT INTO tipos_estudio
        (
            nombre,
            caracteristicas
        )
        VALUES
        (?,?)
        `,
        [
            "PETROMINERAGRAFICOS",

`El presente estudio petromineragráfico tiene como finalidad caracterizar los minerales metálicos y no metálicos de la muestra.

Para ello, se desarrollará una descripción macroscópica y microscópica que abarca la asociación mineral, los tipos de textura, las alteraciones, los reemplazamientos, así como el tamaño y la abundancia de los minerales.

Además, se incluirá la síntesis microscópica, una tabla de alteraciones, la distribución, los estilos de mineralización, secuencia paragenética y la descripción de las microfotografías.`
        ]
    );

});

db.close(() => {

    console.log("==================================");
    console.log("Base de datos creada correctamente");
    console.log("Archivo: estudio_petrografico.db");
    console.log("==================================");

});