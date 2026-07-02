const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const DATASTORE_FILE = path.join(__dirname, "../../database/datastores.json");
const STORES_FOLDER = path.join(__dirname, "../../database/stores");

console.log("__dirname:", __dirname);
console.log("DATASTORE_FILE:", DATASTORE_FILE);
console.log("STORES_FOLDER:", STORES_FOLDER);

console.log("Datastore routes carregadas!");

// Criar datastore
router.post("/create/:name", (req, res) => {

    const name = req.params.name;

    let stores = [];

    if (fs.existsSync(DATASTORE_FILE)) {
        stores = JSON.parse(fs.readFileSync(DATASTORE_FILE, "utf8"));
    }

    if (stores.find(store => store.name === name)) {
        return res.status(400).json({
            success: false,
            message: "Datastore already exists."
        });
    }

    const id = "ds_" + crypto.randomBytes(8).toString("hex");

    stores.push({
        id,
        name,
        createdAt: Date.now()
    });

    fs.writeFileSync(DATASTORE_FILE, JSON.stringify(stores, null, 4));

    fs.mkdirSync(path.join(STORES_FOLDER, id), {
        recursive: true
    });

    res.json({
        success: true,
        datastore: name,
        id
    });

});
// Listar datastores
router.get("/all", (req, res) => {

    let stores = [];

    if (fs.existsSync(DATASTORE_FILE)) {
        stores = JSON.parse(fs.readFileSync(DATASTORE_FILE, "utf8"));
    }

    res.json(stores);

});

router.get("/create/:name", (req, res) => {
    res.json({
        route: "GET",
        name: req.params.name
    });
});

router.get("/teste", (req, res) => {
    res.send("Funcionou!");
});

module.exports = router;