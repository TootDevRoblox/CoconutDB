import json
import os
import requests

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "config.json")

with open(CONFIG_FILE, "r", encoding="utf8") as f:
    config = json.load(f)

SERVER = config["server"].rstrip("/")
MASTER = config["masterKey"]


def headers():
    return {
        "x-master-key": MASTER
    }


def get_keys():
    try:
        response = requests.get(
            SERVER + "/key/all",
            headers=headers(),
            timeout=10
        )
        return response.json()
    except:
        return []


def create_key(name):
    try:
        response = requests.post(
            SERVER + "/key/create",
            headers=headers(),
            json={"name": name},
            timeout=10
        )
        return response.json()
    except:
        return {"success": False}


def delete_key(id):
    try:
        response = requests.delete(
            SERVER + "/key/delete/" + str(id),
            headers=headers(),
            timeout=10
        )
        return response.json()
    except:
        return {"success": False}