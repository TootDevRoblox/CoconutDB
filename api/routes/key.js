const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const master = require("../middleware/master");

const router = express.Router();

const KEY_FILE = path.join(__dirname, "../../database/keys.json");

function loadKeys() {
    if (!fs.existsSync(KEY_FILE)) {
        fs.writeFileSync(KEY_FILE, "[]");
    }

    return JSON.parse(fs.readFileSync(KEY_FILE, "utf8"));
}

function saveKeys(keys) {
    fs.writeFileSync(KEY_FILE, JSON.stringify(keys, null, 4));
}

// Listar todas as keys
router.get("/all", master, (req, res) => {

    const keys = loadKeys();

    res.json(keys);

});

// Criar key
router.post("/create", master, (req, res) => {

    const name = req.body.name || "Unnamed";

    const keys = loadKeys();

    const newKey = {
        id: crypto.randomUUID(),
        name,
        key: "ck_live_" + crypto.randomBytes(24).toString("hex"),
        createdAt: Date.now()
    };

    keys.push(newKey);

    saveKeys(keys);

    res.json({
        success: true,
        key: newKey
    });

});

// Excluir key
router.delete("/delete/:id", master, (req, res) => {

    const id = req.params.id;

    let keys = loadKeys();

    const before = keys.length;

    keys = keys.filter(k => k.id !== id);

    if (keys.length === before) {
        return res.status(404).json({
            success: false,
            message: "Key not found."
        });
    }

    saveKeys(keys);

    res.json({
        success: true
    });

});

// Validar key (usada pelos clientes da API)
router.post("/validate", (req, res) => {

    const { key } = req.body;

    const keys = loadKeys();

    const found = keys.find(k => k.key === key);

    if (!found) {
        return res.status(401).json({
            success: false
        });
    }

    res.json({
        success: true,
        data: found
    });

});

module.exports = router;