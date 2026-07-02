const fs = require("fs");
const path = require("path");

const KEY_FILE = path.join(__dirname, "../../database/keys.json");

module.exports = (req, res, next) => {

    // 🔥 usa header padrão mais comum
    const apiKey =
        req.headers["x-api-key"] ||
        req.headers["authorization"];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: "Missing API Key."
        });
    }

    if (!fs.existsSync(KEY_FILE)) {
        return res.status(500).json({
            success: false,
            message: "Keys file not found."
        });
    }

    let keys;
    try {
        keys = JSON.parse(fs.readFileSync(KEY_FILE, "utf8"));
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to read keys database."
        });
    }

    const found = keys.find(k =>
        k.key === apiKey &&
        k.enabled !== false
    );

    if (!found) {
        return res.status(401).json({
            success: false,
            message: "Invalid API Key."
        });
    }

    // 🔐 expõe key validada
    req.apiKey = found;

    next();
};