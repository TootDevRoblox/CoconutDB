const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const KEYS_FILE = path.join(__dirname, "../../database/keys.json");

function load() {
    if (!fs.existsSync(KEYS_FILE)) {
        fs.writeFileSync(KEYS_FILE, "[]");
    }

    return JSON.parse(fs.readFileSync(KEYS_FILE, "utf8"));
}

function save(keys) {
    fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 4));
}

function createKey(name = "Unnamed") {

    const keys = load();

    const key = {
        id: crypto.randomUUID(),
        name,
        key: "ck_" + crypto.randomBytes(32).toString("hex"),
        createdAt: Date.now(),
        enabled: true
    };

    keys.push(key);

    save(keys);

    return key;
}

function getKeys() {
    return load();
}

function deleteKey(id) {

    let keys = load();

    const before = keys.length;

    keys = keys.filter(k => k.id !== id);

    if (before == keys.length)
        return false;

    save(keys);

    return true;
}

function getKey(keyString) {

    return load().find(k =>
        k.key === keyString &&
        k.enabled
    );

}

module.exports = {
    createKey,
    getKeys,
    deleteKey,
    getKey
};