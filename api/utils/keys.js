const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const KEYS_FILE = path.join(process.cwd(), "database/keys.json");s

console.log("🔥 KEY FILE PATH:", KEYS_FILE);

function loadKeys() {
    if (!fs.existsSync(KEYS_FILE)) {
        fs.writeFileSync(KEYS_FILE, JSON.stringify([]));
    }

    return JSON.parse(fs.readFileSync(KEYS_FILE, "utf8"));
}

function saveKeys(keys) {
    const tmp = KEYS_FILE + ".tmp";

    fs.writeFileSync(tmp, JSON.stringify(keys, null, 2));
    fs.renameSync(tmp, KEYS_FILE);
}

function createKey(name) {
    const keys = loadKeys();

    console.log("🔥 HIT CREATE KEY");

    const newKey = {
        id: crypto.randomUUID(),
        name,
        key: "key_" + crypto.randomBytes(16).toString("hex"),
        createdAt: Date.now(),
        active: true
    };

    keys.push(newKey);
    saveKeys(keys);

    return newKey;
}

function validateKey(key) {
    const keys = loadKeys();

    return keys.find(k => k.key === key && k.active);
}

function deleteKey(id) {
    let keys = loadKeys();

    keys = keys.filter(k => k.id !== id);

    saveKeys(keys);
}

module.exports = {
    createKey,
    validateKey,
    deleteKey,
    loadKeys
};