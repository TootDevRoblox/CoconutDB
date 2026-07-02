const fs = require("fs")
const path = require("path")

class DataStore {

    constructor(seed) {
        this.seed = seed
        this.path = path.join(
            "./database/stores",
            seed
        )

        if (!fs.existsSync(this.path)) {
            throw new Error(
                `DataStore "${seed}" not found.`
            )
        }
    }

    create(id, data) {

        const file = path.join(
            this.path,
            `${id}.json`
        )

        if (fs.existsSync(file)) {
            throw new Error(
                `"${id}" already exists.`
            )
        }

        fs.writeFileSync(
            file,
            JSON.stringify(data, null, 4)
        )

        return data
    }

    get(id, key = null) {

        const file = path.join(
            this.path,
            `${id}.json`
        )

        if (!fs.existsSync(file)) {
            return null
        }

        const data = JSON.parse(
            fs.readFileSync(file, "utf8")
        )

        if (key !== null) {
            return data[key]
        }

        return data
    }

    edit(id, data) {

        const file = path.join(
            this.path,
            `${id}.json`
        )

        if (!fs.existsSync(file)) {
            return null
        }

        const current = JSON.parse(
            fs.readFileSync(file, "utf8")
        )

        const updated = {
            ...current,
            ...data
        }

        fs.writeFileSync(
            file,
            JSON.stringify(updated, null, 4)
        )

        return updated
    }

    delete(id) {

        const file = path.join(
            this.path,
            `${id}.json`
        )

        if (!fs.existsSync(file)) {
            return false
        }

        fs.unlinkSync(file)

        return true
    }

    exists(id) {

        const file = path.join(
            this.path,
            `${id}.json`
        )

        return fs.existsSync(file)
    }

    increment(id, key, amount) {

        const data = this.get(id)

        if (!data) {
            return null
        }

        if (typeof data[key] !== "number") {
            throw new Error(
                `"${key}" is not a number.`
            )
        }

        data[key] += amount

        this.edit(id, data)

        return data[key]
    }

    decrement(id, key, amount) {

        return this.increment(
            id,
            key,
            -amount
        )
    }

    all() {

        const files = fs.readdirSync(this.path)

        const result = {}

        for (const file of files) {

            if (!file.endsWith(".json"))
                continue

            const id = file.replace(".json", "")

            result[id] = JSON.parse(
                fs.readFileSync(
                    path.join(this.path, file),
                    "utf8"
                )
            )
        }

        return result
    }
}

module.exports = {

    async(seed) {

        return new DataStore(seed)

    }

}