from neonize.client import NewClient
from neonize.events import ConnectedEv, MessageEv, event
import segno
import time
import random

from ia import AtendimentoIA

client = NewClient("salao_neia")
ia = AtendimentoIA()

cache_msg = {}

startup_time = time.time()
last_ai_call = 0


# =========================
# HELPERS
# =========================

def get_sender(evt):
    try:
        return str(
            getattr(evt.Info, "SenderJID", None)
            or getattr(evt.Info, "RemoteJid", None)
            or ""
        )
    except:
        return ""


def extract_text(msg):
    return (
        getattr(msg, "conversation", None)
        or (
            getattr(msg, "extendedTextMessage", None)
            and getattr(msg.extendedTextMessage, "text", None)
        )
    )


def anti_duplicate(sender, texto):
    now = time.time()
    key = f"{sender}:{texto}"

    if key in cache_msg and now - cache_msg[key] < 2:
        return True

    cache_msg[key] = now
    return False


# =========================
# CONNECT
# =========================

@client.qr
def qr(client, qr_data: bytes):
    print("Escaneie o QR Code abaixo:\n")
    segno.make_qr(qr_data).terminal(compact=True)


@client.event(ConnectedEv)
def conectado(client, evt):
    print("✅ WhatsApp conectado!")


# =========================
# IA CALL SAFE
# =========================

def safe_ai_call(evt):
    global last_ai_call

    now = time.time()

    if now - last_ai_call < 2:
        time.sleep(2 - (now - last_ai_call))

    last_ai_call = time.time()

    try:
        return ia.responder(evt)
    except Exception as e:
        print("⚠️ ERRO IA:", e)
        return "Pode me enviar uma foto do seu cabelo para avaliação? 😊"


# =========================
# MESSAGE HANDLER
# =========================

@client.event(MessageEv)
def mensagem(client, evt):

    print("\n==============================")
    print("📩 EVENTO RECEBIDO")

    sender = get_sender(evt)
    print("👤 SENDER:", sender)

    if time.time() - startup_time < 2:
        print("⏳ startup delay")
        return

    texto = extract_text(evt.Message)

    if not texto:
        return

    texto = texto.lower().strip()

    print("💬 TEXTO:", texto)

    msg_str = str(evt.Message)

    # =========================
    # IA TEXTO
    # =========================
    if msg_str.startswith("conversation:"):

        if anti_duplicate(sender, texto):
            print("🔁 duplicado ignorado")
            return

        print("🤖 IA chamada")

        resposta = safe_ai_call(evt)

        if resposta:
            client.reply_message(resposta, evt)

        return

    # =========================
    # IMAGEM
    # =========================
    if msg_str.startswith("imageMessage"):

        print("📷 imagem recebida")

        respostas = [
            "Recebemos sua foto 💖 já já a Néia analisa 😊",
            "Foto chegou! 🥰 aguarde avaliação 💖",
            "Perfeito! já vamos analisar 😊"
        ]

        client.reply_message(random.choice(respostas), evt)

        return


client.connect()
event.wait()