const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(message) {
        const { client } = message;

        if (message.author.id === client.user.id) return;
        const conf = client.db.server.get(message.guild.id);

        if (conf) {
            if (message.channel.id === conf.channel && message.author.id === "302050872383242240" && message.embeds[0].description.includes("Bump done!")) {
                client.scheduler.scheduleJob(client.utils.addTime(new Date(), 120), () => {
                    return message.channel.send(`<@&${conf.role}> ${conf.message}`);
                });
            };
        };
    },
};