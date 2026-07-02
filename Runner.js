const fs = require("fs")
const path = require("path")
const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const DATASTORE_FILE = "./database/datastores.json"

function generateSeed(name) {
    const random1 = Math.floor(Math.random() * 9999)
    const random2 = Math.floor(Math.random() * 9999)

    return `${name}${random1}.${random2}`
}

console.clear()

console.log(`
╔════════════════════╗
║     CoconutDB      ║
╚════════════════════╝
`)

rl.question("Create DataStore? (Y/N Name): ", (answer) => {

    const split = answer.split(" ")

    const option = split[0]
    const datastoreName = split[1]

    if (option.toUpperCase() !== "Y") {
        console.log("Canceled.")
        rl.close()
        return
    }

    if (!datastoreName) {
        console.log("Missing datastore name.")
        rl.close()
        return
    }

    const seed = generateSeed(datastoreName)

    const stores = JSON.parse(
        fs.readFileSync(DATASTORE_FILE, "utf8")
    )

    stores.push({
        name: datastoreName,
        seed: seed,
        createdAt: Date.now()
    })

    fs.writeFileSync(
        DATASTORE_FILE,
        JSON.stringify(stores, null, 4)
    )

    fs.mkdirSync(
        path.join("./database/stores", seed),
        { recursive: true }
    )

    console.log("\nCreating datastore...")
    
    setTimeout(() => {
        console.log(`\nCoconutDB Created!`)
        console.log(`Seed: ${seed}`)
        rl.close()
    }, 1500)
})