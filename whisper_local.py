from faster_whisper import WhisperModel
import tempfile
import os

print("Cargando modelo Whisper...")

modelo = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

print("Whisper listo.")


def reconocer_con_whisper(audio):

    with tempfile.NamedTemporaryFile(
        suffix=".wav",
        delete=False
    ) as archivo:

        archivo.write(audio.get_wav_data())

        nombre = archivo.name

    try:

        segmentos, _ = modelo.transcribe(
            nombre,
            language="es",
            beam_size=5,
            vad_filter=True,
            initial_prompt="""
            Informe petrográfico informe mineragráfico
            petrografía mineragrafía
            petrograficos mineragraficos
            petromineragraficos
            geología geometalurgia
            microscopio macroscópico
            microscópico paragénesis
            alteración mineralización
            muestra laboratorio
            GeoPilot.
            """
        )

        texto = " ".join(
            segmento.text
            for segmento in segmentos
        )

        return texto.strip().lower()

    finally:

        if os.path.exists(nombre):
            os.remove(nombre)