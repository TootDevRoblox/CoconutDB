console.log("📄 Documents carregado!");

const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const STORES_FOLDER = path.join(__dirname, "../../database/stores");

router.post("/set/:datastore/:document", (req, res) => {

    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    const datastore = req.params.datastore;
    const document = req.params.document;
    const data = req.body || {
        Coins: 999
    };

    // resto do código...

console.log(data);

    if (!datastore || !document) {
        return res.status(400).json({
            success: false,
            message: "Missing datastore or document."
        });
    }

    const datastoreFolder = path.join(
        STORES_FOLDER,
        datastore
    );

    fs.mkdirSync(datastoreFolder, {
        recursive: true
    });

    const documentFile = path.join(
        datastoreFolder,
        `${document}.json`
    );

    console.log(req.body);

    fs.writeFileSync(
        documentFile,
        JSON.stringify(data, null, 4)
    );

    res.json({
        success: true,
        datastore,
        document
    });

});

router.get("/get/:datastore/:document", (req, res) => {

    const datastore = req.params.datastore;
    const document = req.params.document;

    const documentFile = path.join(
        STORES_FOLDER,
        datastore,
        `${document}.json`
    );

    if (!fs.existsSync(documentFile)) {
        return res.status(404).json({
            success: false,
            message: "Document not found."
        });
    }

    const data = JSON.parse(
        fs.readFileSync(documentFile, "utf8")
    );

    res.json({
        success: true,
        datastore,
        document,
        data
    });

});

router.get("/teste", (req, res) => {
    res.send("Documents funcionando!");
});

module.exports = router;