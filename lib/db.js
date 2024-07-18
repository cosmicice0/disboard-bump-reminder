const path = require("node:path");
const fs = require("node:fs");
const db = require("./db.json");

const server = {
    init: (id) => {
        db.servers[id] = {};
        write();
    },
    update: (id, config) => {
        db.servers[id] = config;
        write();
    },
    remove: (id) => {
        db.servers = db.servers.filter(server => server !== id);
    },
    get: (id) => {
        return db.servers[id];
    },
};

const write = () => {
    fs.writeFileSync(path.join(__dirname, "./db.json"), JSON.stringify(db, null, 2));
};

module.exports = {
    server,
};