import json
import os
import requests

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "config.json")

with open(CONFIG_FILE, "r", encoding="utf8") as f:
    config = json.load(f)

SERVER = config["server"].rstrip("/")
MASTER = config["masterKey"]


# =========================
# HEADERS (MASTER KEY)
# =========================
def headers():
    return {
        "x-master-key": MASTER
    }


# =========================
# KEYS
# =========================
def get_keys():
    try:
        r = requests.get(
            SERVER + "/key/all",
            headers=headers(),
            timeout=10
        )
        return r.json()
    except:
        return []


def create_key(name):
    try:
        r = requests.post(
            SERVER + "/key/create",
            headers=headers(),
            json={"name": name},
            timeout=10
        )
        return r.json()
    except:
        return {"success": False}


def delete_key(key_id):
    try:
        r = requests.delete(
            SERVER + f"/key/delete/{key_id}",
            headers=headers(),
            timeout=10
        )
        return r.json()
    except:
        return {"success": False}


# =========================
# DATASTORES (LISTAR KEYS COMO "DATASTORES")
# =========================
def get_datastores():
    try:
        r = requests.get(
            SERVER + "/datastore/all",
            headers=headers(),
            timeout=10
        )
        return r.json()
    except:
        return []


def create_datastore(name):
    try:
        r = requests.post(
            SERVER + f"/datastore/create/{name}",
            headers=headers(),
            timeout=10
        )
        return r.json()
    except:
        return {"success": False}


# =========================
# DOCUMENTS
# =========================
def get_documents(datastore):
    try:
        r = requests.get(
            SERVER + f"/document/all/{datastore}",
            headers=headers(),
            timeout=10
        )
        return r.json()
    except:
        return []


def get_document(datastore, document):
    try:
        r = requests.get(
            SERVER + f"/document/get/{datastore}/{document}",
            headers=headers(),
            timeout=10
        )
        return r.json()
    except:
        return {"success": False}


def set_document(datastore, document, data):
    try:
        r = requests.post(
            SERVER + f"/document/set/{datastore}/{document}",
            headers=headers(),
            json=data,
            timeout=10
        )
        return r.json()
    except:
        return {"success": False}


def delete_document(datastore, document):
    try:
        r = requests.delete(
            SERVER + f"/document/delete/{datastore}/{document}",
            headers=headers(),
            timeout=10
        )
        return r.json()
    except:
        return {"success": False}