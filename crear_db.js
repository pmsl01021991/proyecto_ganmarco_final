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
        "PETROGRAFICOS+MINERAGRAFICOS",

        `El presente informe está orientado a la caracterización mineral de las muestras mediante los siguientes estudios:

        • Estudio Petrográfico: Se centra en los minerales no metálicos, desarrollando una descripción macroscópica y microscópica de la asociación mineral, los tipos de textura, las alteraciones y los reemplazamientos, así como el tamaño y su abundancia. Este apartado se complementa con la síntesis microscópica, una tabla de alteraciones, la distribución y la descripción de las microfotografías correspondientes.

        • Estudio Mineragráfico: Aborda los minerales metálicos a través de una evaluación que detalla la asociación mineral, los tipos de textura y los reemplazamientos, además de documentar el tamaño y la abundancia de estos minerales. Finalmente, esta sección incorpora los estilos de mineralización, la secuencia paragenética y la descripción de las microfotografías.`
        ]
        );

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
            "PETROGRAFICOS+PETROMINERAGRAFICOS",

            `El presente informe está orientado a la caracterización mineral de las muestras mediante los siguientes estudios:

            • Estudio Petrográfico: Centrado en los minerales no metálicos. Desarrolla una descripción macroscópica y microscópica de la asociación mineral, los tipos de textura, las alteraciones y los reemplazamientos, así como el tamaño y su abundancia. Este apartado se complementa con la síntesis microscópica, una tabla de alteraciones, la distribución y las microfotografías correspondientes.

            • Estudio Petromineragráfico: Abarca conjuntamente los minerales metálicos y no metálicos. Detalla a nivel macroscópico y microscópico la asociación mineral, los tipos de textura, las alteraciones y los reemplazamientos, registrando también las dimensiones y abundancia de los minerales. Finalmente, la sección incorpora la síntesis microscópica, una tabla de alteraciones y su distribución, sumando los estilos de mineralización, la secuencia paragenética y la descripción de las microfotografías.`
            ]
            );

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
                "PETROMINERAGRAFICOS+MINERAGRAFICOS",

                `El presente informe está orientado a la caracterización mineral de las muestras mediante los siguientes estudios:

                • Estudio Petromineragráfico: Integra la evaluación de los minerales metálicos y no metálicos. Se desarrolla una descripción macroscópica y microscópica de la asociación mineral, las texturas, alteraciones y reemplazamientos, así como el tamaño y su abundancia. El apartado se completa presentando la síntesis microscópica, una tabla de alteraciones con su distribución, los estilos de mineralización, la secuencia paragenética y las respectivas microfotografías.

                • Estudio Mineragráfico: Enfocado en los minerales metálicos a través de una evaluación que detalla la asociación mineral, los tipos de textura y los reemplazamientos, además de documentar el tamaño y la abundancia de estos minerales. Esta sección incorpora los estilos de mineralización, la secuencia paragenética y la descripción de las microfotografías.`
                ]
                );

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
                    "PETROGRAFICOS+PETROMINERAGRAFICOS+MINERAGRAFICOS",

                    `El presente informe está orientado a la caracterización mineral de las muestras mediante los siguientes estudios:

                    • Estudio Petrográfico: Centrado en los minerales no metálicos, desarrollando una descripción macroscópica y microscópica de la asociación mineral, los tipos de textura, las alteraciones y los reemplazamientos, así como el tamaño y su abundancia. Este apartado se complementa con la síntesis microscópica, una tabla de alteraciones, la distribución y las microfotografías correspondientes.

                    • Estudio Mineragráfico: Aborda los minerales metálicos mediante una evaluación que detalla la asociación mineral, los tipos de textura y los reemplazamientos, además de documentar las dimensiones y abundancia de estos minerales. Esta sección incorpora los estilos de mineralización, la secuencia paragenética y el registro fotográfico.

                    • Estudio Petromineragráfico: Engloba conjuntamente los minerales metálicos y no metálicos. En este análisis se detalla a nivel macroscópico y microscópico la asociación mineral, los tipos de textura, las alteraciones y los reemplazamientos, registrando el tamaño y abundancia de los minerales. Para consolidar la caracterización, se incluye la síntesis microscópica, una tabla de alteraciones y su distribución, junto con los estilos de mineralización, la secuencia paragenética y la descripción de las microfotografías.`
                    ]
                    );

});

db.close(() => {

    console.log("==================================");
    console.log("Base de datos creada correctamente");
    console.log("Archivo: estudio_petrografico.db");
    console.log("==================================");

});