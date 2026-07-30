# GeoPilot IA

Sistema inteligente para la generación asistida de informes petrográficos, mineragráficos y petromineragráficos mediante reconocimiento de voz, inteligencia artificial y automatización documental.

---

# Descripción

GeoPilot IA es una aplicación de escritorio desarrollada para optimizar la elaboración de informes geológicos utilizados en laboratorios de mineralogía y petrografía.

El sistema permite al especialista generar la información del informe mediante comandos de voz, reduciendo considerablemente el tiempo de elaboración y minimizando errores de digitación.

GeoPilot IA integra una interfaz web, un asistente de voz en Python y un servidor Node.js que trabajan conjuntamente para automatizar la construcción del informe técnico.

El objetivo final del proyecto es generar automáticamente un documento PDF completamente estructurado a partir de la información ingresada por el usuario.

---

# Características principales

- Asistente de voz integrado.
- Reconocimiento de voz en español.
- Dictado continuo para textos largos.
- Generación automática de introducciones.
- Gestión de estudios petrográficos.
- Gestión de estudios mineragráficos.
- Gestión de estudios petromineragráficos.
- Soporte para múltiples combinaciones de estudios.
- Base de datos SQLite integrada.
- Interfaz web local.
- Funcionamiento completamente offline (excepto reconocimiento de voz y síntesis mediante servicios utilizados por SpeechRecognition y Edge TTS).
- Empaquetado como aplicación Windows (.exe).

---

# Arquitectura

```
Python
│
├── Asistente de voz
│     ├── SpeechRecognition
│     ├── Edge TTS
│     ├── Pygame
│     └── Tkinter
│
└─────────────── HTTP
                 │
                 ▼
Node.js + Express
│
├── API REST
├── SQLite
└── Servidor Web
        │
        ▼
HTML
CSS
JavaScript
```

---

# Tecnologías utilizadas

## Backend

- Node.js
- Express
- SQLite

## Frontend

- HTML5
- CSS3
- JavaScript

## Asistente inteligente

- Python
- SpeechRecognition
- Edge TTS
- Pygame
- Tkinter

## Base de datos

- SQLite

---

# Estructura del proyecto

```
GeoPilot/
│
├── componentes/
├── css/
├── js/
│   └── modulos/
├── node/
├── node_modules/
├── asistente_petrografico.py
├── interfaz_jarvis.py
├── iniciar_geopilot.py
├── server.js
├── crear_db.js
├── estudio_petrografico.db
├── index.html
└── package.json
```

---

# Flujo de funcionamiento

1. El usuario inicia GeoPilot.
2. Se levanta automáticamente el servidor Node.js.
3. Se abre la interfaz web.
4. Se inicia el asistente de voz.
5. El usuario dicta la información.
6. El asistente interpreta el comando.
7. Los datos se envían al servidor.
8. La aplicación actualiza automáticamente el formulario.
9. La información se almacena en SQLite.
10. El informe se construye progresivamente.
11. Finalmente se genera el documento PDF del informe técnico.

---

# Funcionalidades actuales

- Introducción automática.
- Captura por voz.
- Dictado continuo.
- Carga de documentos Word.
- Panel de microfotografías.
- Caracterización mineralógica.
- Marco metodológico.
- Gestión de estudios combinados.
- Persistencia de información.

---

# Funcionalidades en desarrollo

- Generación automática del PDF final.
- Exportación a Microsoft Word.
- Generación automática de tablas.
- Automatización de capítulos restantes del informe.
- Integración de inteligencia artificial para asistencia técnica.
- Automatización completa del flujo de elaboración del informe.

---

# Base de datos

Actualmente el sistema utiliza SQLite.

Tablas principales:

- introduccion_informe
- tipos_estudio

---

# Ejecución durante el desarrollo

## Instalar dependencias de Node

```bash
npm install
```

## Crear la base de datos

```bash
node crear_db.js
```

## Ejecutar la aplicación

```bash
python iniciar_geopilot.py
```

---

# Empaquetado

La aplicación puede distribuirse como un ejecutable de Windows utilizando PyInstaller.

El ejecutable incluye:

- Python
- Node.js
- SQLite
- Servidor Express
- Recursos gráficos
- Archivos HTML
- CSS
- JavaScript

Por lo tanto, el usuario final no necesita instalar Python ni Node.js para utilizar GeoPilot IA.

---

# Objetivo del proyecto

Desarrollar una plataforma inteligente que permita elaborar informes petrográficos, mineragráficos y petromineragráficos de forma rápida, uniforme y automatizada, reduciendo significativamente el tiempo de elaboración y facilitando la generación del informe final en formato PDF.

---

# Estado del proyecto

Actualmente GeoPilot IA se encuentra en desarrollo activo, incorporando nuevas funcionalidades orientadas a la automatización integral del proceso de elaboración de informes geológicos.

---

# Generar el ejecutable (.exe)

GeoPilot IA puede empaquetarse como una aplicación de Windows utilizando **PyInstaller**. El ejecutable incluye el servidor Node.js, la interfaz web, la base de datos SQLite y todos los recursos necesarios para que el usuario final no tenga que instalar Python ni Node.js.

## Comando de compilación

Ejecutar el siguiente comando desde la carpeta raíz del proyecto:

```bash
python -m PyInstaller --onedir --windowed --clean --name GeoPilot --add-data "jarvis4.gif;." --add-data "WhatsApp Image 2026-06-15 at 7.24.25 PM.jpeg;." --add-data "Logo_Proyect.png;." --add-data "server.js;." --add-data "package.json;." --add-data "index.html;." --add-data "estudio_petrografico.db;." --add-data "componentes;componentes" --add-data "css;css" --add-data "js;js" --add-data "node;node" --add-data "node_modules;node_modules" --collect-all PIL --collect-all speech_recognition --collect-all pyaudio --collect-all pygame --collect-all edge_tts iniciar_geopilot.py
```

## Resultado

Al finalizar la compilación, PyInstaller generará las siguientes carpetas:

```
build/
dist/
```

El ejecutable principal se encontrará en:

```
dist/
└── GeoPilot/
    └── GeoPilot.exe
```

Ese directorio contiene todos los archivos necesarios para ejecutar la aplicación en otra computadora con Windows, sin necesidad de instalar Python ni Node.js.

> **Nota:** Si se realizan cambios importantes en el proyecto, es recomendable eliminar previamente las carpetas `build/`, `dist/` y el archivo `GeoPilot.spec` antes de volver a generar el ejecutable para asegurar una compilación completamente limpia.