const fs = require("fs");

const KEY_FILE = "./database/keys.json";

module.exports = (req, res, next) => {

    const apiKey = req.headers.authorization;

    if (!apiKey) {

        return res.status(401).json({
            success: false,
            message: "Missing API Key."
        });

    }

    const keys = JSON.parse(
        fs.readFileSync(KEY_FILE, "utf8")
    );

    const found = keys.find(
        k => k.key === apiKey
    );

    if (!found) {

        return res.status(401).json({
            success: false,
            message: "Invalid API Key."
        });

    }

    next();

}