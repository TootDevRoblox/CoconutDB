
console.log("🔑 KEY ROUTE LOADED");

const express = require("express");
const router = express.Router();

const {
    createKey,
    loadKeys,
    deleteKey
} = require("../utils/keys");

// 🔐 criar key
router.post("/create", (req, res) => {
    const name = req.body.name;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Missing name"
        });
    }

    const key = createKey(name);

    res.json({
        success: true,
        key
    });
});

// 📄 listar keys
router.get("/all", (req, res) => {
    res.json(loadKeys());
});

// 🗑️ deletar key
router.delete("/delete/:id", (req, res) => {
    deleteKey(req.params.id);

    res.json({
        success: true
    });
});

module.exports = router;