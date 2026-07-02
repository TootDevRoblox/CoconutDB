const fs = require("fs");
const path = require("path");

const KEY_FILE = path.join(__dirname, "../../database/keys.json");

module.exports = (req, res, next) => {

    const apiKey = req.headers["x-api-key"];

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

    const keys = JSON.parse(fs.readFileSync(KEY_FILE, "utf8"));

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

    // Disponibiliza a key para as próximas rotas
    req.apiKey = found;

    next();

};