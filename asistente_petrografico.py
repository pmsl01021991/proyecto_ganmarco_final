import speech_recognition as sr
import os
import requests
import sys
import time
import threading
import asyncio
import edge_tts
import pygame
import unicodedata
from interfaz_jarvis import InterfazJarvisAnimada

def normalizar_texto(texto):

    texto = texto.lower()

    texto = ''.join(

        c for c in unicodedata.normalize("NFD", texto)

        if unicodedata.category(c) != "Mn"

    )

    return texto

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

pygame.mixer.init()

recognizer.energy_threshold = 300
recognizer.dynamic_energy_threshold = True
recognizer.pause_threshold = 2.2
recognizer.non_speaking_duration = 0.3
recognizer.operation_timeout = 5

SERVIDOR_GEOPILOT = "http://localhost:3000/procesar-voz"


def recurso(ruta_relativa):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, ruta_relativa)


def hablar(texto, mostrar=False):

    if mostrar:
        print("GeoPilot:", texto)

    asyncio.run(_hablar(texto))


async def _hablar(texto):

    archivo = "voz.mp3"

    communicate = edge_tts.Communicate(

        text=texto,

        voice="es-PE-CamilaNeural",

        rate="+20%"

    )

    await communicate.save(archivo)

    pygame.mixer.music.load(archivo)
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        await asyncio.sleep(0.01)

    pygame.mixer.music.unload()

    if os.path.exists(archivo):
        os.remove(archivo)


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

    if "desactiva el microfono" in comando or \
       "apaga el microfono" in comando or \
       "desactivar microfono" in comando:

        desactivar_microfono()
        return

    elif "activa el microfono" in comando or \
         "activar el microfono" in comando or \
         "enciende el microfono" in comando:

        activar_microfono()
        return
    
    elif ("nuevo informe" in comando or "nueva introduccion" in comando):   

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
        enviar_a_formulario(comando)


def iniciar_jarvis():
    global proxima_escucha_larga, dictado_completo_activo, texto_acumulado
    try:
        hablar("Asistente geopilot iniciado.")
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

                        try:
                            texto_activador = normalizar_texto(
                                recognizer.recognize_google(
                                    audio,
                                    language="es-PE"
                                )
                            )
                        except:
                            texto_activador = ""
                        print("Activador:", texto_activador)

                        if any(a in texto_activador for a in ACTIVADORES):
                            activar_microfono()

                    except:
                        pass

                time.sleep(0.2)
                continue

            with sr.Microphone() as source:
                print("\n🎤 Escuchando...")

                limite_escucha = 65 if proxima_escucha_larga else 10
                recognizer.pause_threshold = 5.5 if proxima_escucha_larga else 2.2

                audio = recognizer.listen(
                    source,
                    timeout=12,
                    phrase_time_limit=limite_escucha
                )

                proxima_escucha_larga = False
                recognizer.pause_threshold = 2.2

            try:
                texto = normalizar_texto(
                    recognizer.recognize_google(
                        audio,
                        language="es-PE"
                    )
                )

            except sr.UnknownValueError:
                texto = ""

            except sr.RequestError:
                texto = ""
            # ==========================
            # PETROGRAFICOS
            # ==========================

            texto = texto.replace("petro gráficos", "petrograficos")
            texto = texto.replace("petro gráfico", "petrografico")
            texto = texto.replace("pedro gráficos", "petrograficos")
            texto = texto.replace("pedro gráfico", "petrografico")
            texto = texto.replace("petro graficos", "petrograficos")
            texto = texto.replace("petro grafico", "petrografico")

            # ==========================
            # MINERAGRAFICOS
            # ==========================

            texto = texto.replace("minera gráficos", "mineragraficos")
            texto = texto.replace("minera gráfico", "mineragrafico")
            texto = texto.replace("minero gráficos", "mineragraficos")
            texto = texto.replace("minero gráfico", "mineragrafico")
            texto = texto.replace("ninera gráficos", "mineragraficos")
            texto = texto.replace("ninera graficos", "mineragraficos")
            texto = texto.replace("ni nera graficos", "mineragraficos")
            texto = texto.replace("minera graficos", "mineragraficos")
            texto = texto.replace("minera grafico", "mineragrafico")

            # ==========================
            # PETROMINERAGRAFICOS
            # ==========================

            texto = texto.replace("petro minera gráficos", "petromineragraficos")
            texto = texto.replace("petro minera gráfico", "petromineragrafico")
            texto = texto.replace("petrominera gráficos", "petromineragraficos")
            texto = texto.replace("petrominera gráfico", "petromineragrafico")
            texto = texto.replace("petro minera graficos", "petromineragraficos")
            texto = texto.replace("petro minera grafico", "petromineragrafico")

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