CREATE TABLE introduccion_informe (

    id INT AUTO_INCREMENT PRIMARY KEY,

    requerimiento VARCHAR(200),

    empresa VARCHAR(200),

    tipoEstudio VARCHAR(300),

    textoIntroduccion LONGTEXT,

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

ALTER TABLE introduccion_informe
ADD COLUMN muestra VARCHAR(200);

select * from introduccion_informe;

CREATE TABLE tipos_estudio (

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100),

    caracteristicas LONGTEXT

);

INSERT INTO tipos_estudio
(nombre, caracteristicas)
VALUES
(
'PETROGRAFICOS',
'minerales no metálicos, tamaño de los minerales, su abundancia porcentual, los parámetros texturales y las asociaciones mineralógicas'
);

INSERT INTO tipos_estudio
(nombre, caracteristicas)
VALUES
(
'MINERAGRAFICOS',
'minerales metálicos, su abundancia porcentual, los parámetros texturales y las asociaciones mineralógicas'
);


INSERT INTO tipos_estudio
(nombre, caracteristicas)
VALUES
(
'PETROMINERAGRAFICOS',
'minerales metálicos y no metálicos, tamaño de los minerales, abundancia porcentual, parámetros texturales y asociaciones mineralógicas'
);
