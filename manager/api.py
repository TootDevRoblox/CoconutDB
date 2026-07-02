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
    response = requests.get(
        SERVER + "/key/all",
        headers=headers()
    )

    return response.json()


def create_key(name):
    response = requests.post(
        SERVER + "/key/create",
        headers=headers(),
        json={
            "name": name
        }
    )

    return response.json()


def delete_key(id):
    response = requests.delete(
        SERVER + "/key/delete/" + id,
        headers=headers()
    )

    return response.json()