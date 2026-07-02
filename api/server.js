const express = require("express");

const keyRoutes = require("./routes/key");
const datastoreRoutes = require("./routes/datastores");
const documentRoutes = require("./routes/documents");

const auth = require("./middleware/auth");

const app = express();

app.use(express.json());

// 🌐 PUBLIC ROUTES
app.get("/", (req, res) => {
    res.json({
        success: true,
        name: "CoconutDB",
        version: "1.5"
    });
});

// 🔐 KEY ROUTES (não precisa auth aqui)
app.use("/key", keyRoutes);

// 🟡 PROTEGIDO (DataStore system)
app.use("/datastore", auth, datastoreRoutes);
app.use("/document", auth, documentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🥥 CoconutDB API Online!");
    console.log(`Listening on port ${PORT}`);
});