import subprocess
import time
import webbrowser
import os
import sys
from asistente_petrografico import iniciar_asistente

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def recurso(ruta):
    try:
        base = sys._MEIPASS
    except Exception:
        base = BASE_DIR
    return os.path.join(base, ruta)

subprocess.run(
   ["taskkill", "/F", "/IM", "node.exe"],
   stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)

time.sleep(1)

startupinfo = subprocess.STARTUPINFO()
startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW

subprocess.Popen(
    ["node", recurso("server.js")],
    cwd=BASE_DIR,
    stdout=None,
    stderr=None,
    startupinfo=startupinfo,
    creationflags=subprocess.CREATE_NO_WINDOW
)

time.sleep(3)

webbrowser.open_new("http://localhost:3000")

iniciar_asistente()