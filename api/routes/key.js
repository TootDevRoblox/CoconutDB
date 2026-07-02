const express = require("express");
const fs = require("fs");
const crypto = require("crypto");

const router = express.Router();

const KEY_FILE = "./database/keys.json";

function loadKeys() {
    return JSON.parse(fs.readFileSync(KEY_FILE, "utf8"));
}

function saveKeys(keys) {
    fs.writeFileSync(KEY_FILE, JSON.stringify(keys, null, 4));
}

router.post("/generate", (req, res) => {

    const name = req.body.name || "Unnamed";

    const key = "ck_live_" + crypto.randomBytes(24).toString("hex");

    const keys = loadKeys();

    keys.push({
        name,
        key,
        createdAt: Date.now()
    });

    saveKeys(keys);

    res.json({
        success: true,
        key
    });

});

router.post("/validate", (req, res) => {

    const { key } = req.body;

    const keys = loadKeys();

    const exists = keys.find(k => k.key === key);

    if (!exists) {
        return res.status(401).json({
            success: false
        });
    }

    res.json({
        success: true,
        data: exists
    });

});

module.exports = router;