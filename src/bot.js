const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
});

bot.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) bot.commands.set(command.data.name, command);
};

const eventsPath = path.join(__dirname, "events");
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventsFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) bot.once(event.name, (...args) => event.execute(...args))
    else bot.on(event.name, (...args) => event.execute(...args));
};

bot.scheduler = require("node-schedule");
bot.utils = require("../lib/utils");
bot.db = require("../lib/db");

bot.login(process.env.CLIENT_TOKEN);