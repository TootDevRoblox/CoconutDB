const express = require("express");

const keyRoutes = require("./routes/key");
const datastoreRoutes = require("./routes/datastores");
const documentRoutes = require("./routes/documents");

const app = express();

app.use(express.json());

app.use("/key", keyRoutes);
app.use("/datastore", datastoreRoutes);
app.use("/document", documentRoutes);

app.get("/", (req, res) => {

    res.json({
        success: true,
        name: "CoconutDB",
        version: "1.5"
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("🥥 CoconutDB API Online!");
    console.log(`Listening on port ${PORT}`);

});