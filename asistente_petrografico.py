import speech_recognition as sr
import subprocess
import winsound
import os
import requests
import uuid
import sys
import time
import threading

from interfaz_jarvis import InterfazJarvisAnimada
from vosk_local import reconocer_con_vosk

escuchando = True
microfono_bloqueado = False
proxima_escucha_larga = False
dictado_completo_activo = False
texto_acumulado = ""

ACTIVADORES = (
    "asistente",
    "hola asistente",
    "oye asistente",
    "asistente estás ahí",
    "asistente estas ahi",
)

recognizer = sr.Recognizer()
recognizer.energy_threshold = 300
recognizer.dynamic_energy_threshold = True
recognizer.pause_threshold = 2.2

SERVIDOR_GEOPILOT = "http://localhost:3000/procesar-voz"


def recurso(ruta_relativa):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, ruta_relativa)


def hablar(texto, mostrar=False):
    if mostrar:
        print("Jarvis:", texto)

    archivo_salida = f"voz_{uuid.uuid4()}.wav"

    comando = [
        PIPER_EXE,
        "--model", PIPER_MODEL,
        "--output_file", archivo_salida
    ]

    startupinfo = subprocess.STARTUPINFO()
    startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW

    subprocess.run(
        comando,
        input=texto,
        text=True,
        encoding="utf-8",
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        startupinfo=startupinfo,
        creationflags=subprocess.CREATE_NO_WINDOW
    )

    winsound.PlaySound(archivo_salida, winsound.SND_FILENAME)

    if os.path.exists(archivo_salida):
        os.remove(archivo_salida)
        
PIPER_EXE = recurso(r"piper_windows_amd64\piper\piper.exe")
PIPER_MODEL = recurso(r"piper_windows_amd64\piper\voices\es_ES-davefx-medium.onnx")


def desactivar_microfono():
    global escuchando, microfono_bloqueado

    microfono_bloqueado = True
    escuchando = False

    jarvis_ui.cambiar_color_texto("microfono_desactivado")
    jarvis_ui.actualizar_estado("🎙️ Micrófono desactivado")

    hablar("Micrófono desactivado.")


def activar_microfono():
    global escuchando, microfono_bloqueado

    microfono_bloqueado = False
    escuchando = True

    jarvis_ui.cambiar_color_texto("microfono_activado")
    jarvis_ui.actualizar_estado("🎙️ Micrófono activado")

    hablar("Micrófono activado.")

def enviar_a_formulario(texto):
    global proxima_escucha_larga, dictado_completo_activo, texto_acumulado

    try:
        respuesta = requests.post(
            SERVIDOR_GEOPILOT,
            json={"texto": texto},
            timeout=180
        )

        data = respuesta.json()

        if data.get("ok"):
            comando = data.get("comando", {})

            if comando.get("modo") == "dictado_completo":
                proxima_escucha_larga = True
                dictado_completo_activo = True
                texto_acumulado = ""

            respuesta_voz = data.get("respuestaVoz", "")

            if respuesta_voz:
                hablar(respuesta_voz)
            else:
                hablar("Registrado.")
        else:
            hablar("No pude enviar el dictado al formulario.")

    except Exception as e:
        print("Error enviando al formulario:", e)
        hablar("No pude conectarme con el sistema GeoPilot.")


def ejecutar_comando(comando):
    comando = comando.lower()

    if "desactiva el micrófono" in comando or \
       "apaga el micrófono" in comando or \
       "desactivar micrófono" in comando:

        desactivar_microfono()
        return

    elif "activa el micrófono" in comando or \
         "activar el micrófono" in comando or \
         "enciende el micrófono" in comando:

        activar_microfono()
        return
    elif (
        "nuevo informe" in comando
        or
        "nueva introduccion" in comando
    ):

        jarvis_ui.cambiar_color_texto("pensando")
        jarvis_ui.actualizar_estado(
            "📄 Iniciando nueva introducción..."
        )

        enviar_a_formulario(comando)
        return

    elif "salir" in comando or "cerrar" in comando:
            hablar("Hasta luego.")
            os._exit(0)

    else:
        jarvis_ui.cambiar_color_texto("pensando")
        jarvis_ui.actualizar_estado("🧠 Procesando informacion...")

        enviar_a_formulario(comando)

        jarvis_ui.cambiar_color_texto("Esperando")
        jarvis_ui.actualizar_estado("Esperando comandos de GeoPilot...")


def iniciar_jarvis():
    global proxima_escucha_larga, dictado_completo_activo, texto_acumulado
    try:
        hablar("Asistente gepilot iniciado.")
    except Exception as e:
        print("Error con Piper:", e)

    with sr.Microphone() as source:
        print("Calibrando micrófono...")
        recognizer.adjust_for_ambient_noise(source, duration=1)

    while True:
        try:
            if not escuchando:
                with sr.Microphone() as source:
                    try:
                        audio = recognizer.listen(
                            source,
                            timeout=3,
                            phrase_time_limit=3
                        )

                        texto_activador = reconocer_con_vosk(audio).lower()
                        print("Activador:", texto_activador)

                        if any(a in texto_activador for a in ACTIVADORES):
                            activar_microfono()

                    except:
                        pass

                time.sleep(0.2)
                continue

            with sr.Microphone() as source:
                print("\n🎤 Escuchando...")
                jarvis_ui.cambiar_color_texto("escuchando")
                jarvis_ui.actualizar_estado("🎤 Escuchando informe petrografico...")

                limite_escucha = 65 if proxima_escucha_larga else 10
                recognizer.pause_threshold = 5.5 if proxima_escucha_larga else 2.2

                audio = recognizer.listen(
                    source,
                    timeout=12,
                    phrase_time_limit=limite_escucha
                )

                proxima_escucha_larga = False
                recognizer.pause_threshold = 2.2

            texto = reconocer_con_vosk(audio)
            texto = texto.lower()

            texto = texto.replace("hombre ", "nombre ")
            texto = texto.replace("cinco doce", "cincuenta y dos")
            texto = texto.replace("treintaicinco", "treinta y cinco")
            print("GeoPilot:", texto)

            if not texto:
                print("No detectó texto.")
                jarvis_ui.actualizar_estado("No entendí, intenta otra vez.")
                continue
            if dictado_completo_activo:
                texto_acumulado += " " + texto

                jarvis_ui.mostrar_texto_escuchado(texto_acumulado.strip())

                if (
                    "fin del mensaje" in texto_acumulado.lower()
                    or
                    "fin del dictado" in texto_acumulado.lower()
                ):
                    texto_final = texto_acumulado.lower()

                    texto_final = texto_final.replace(
                        "fin del mensaje",
                        ""
                    )

                    texto_final = texto_final.replace(
                        "fin del dictado",
                        ""
                    )

                    texto_final = texto_final.strip()

                    dictado_completo_activo = False
                    texto_acumulado = ""

                    jarvis_ui.cambiar_color_texto("pensando")
                    jarvis_ui.actualizar_estado("🧠 Procesando introducción...")

                    enviar_a_formulario(texto_final)

                    jarvis_ui.cambiar_color_texto("Esperando")
                    jarvis_ui.actualizar_estado("Esperando nueva introducción...")

                else:
                    proxima_escucha_larga = True
                    jarvis_ui.actualizar_estado("Siga dictando. Diga fin del mensaje para terminar.")

                continue

            jarvis_ui.mostrar_texto_escuchado(texto)
            ejecutar_comando(texto)

        except sr.WaitTimeoutError:
            print("No escuché nada.")
            jarvis_ui.actualizar_estado("Esperando informe petrografico...")

        except Exception as e:
            print("Error:", e)
            jarvis_ui.actualizar_estado("No entendí, intenta otra vez.")


def iniciar_asistente():
    global jarvis_ui

    jarvis_ui = InterfazJarvisAnimada(recurso)

    threading.Thread(
        target=iniciar_jarvis,
        daemon=True
    ).start()

    jarvis_ui.ventana.mainloop()


if __name__ == "__main__":
    iniciar_asistente()