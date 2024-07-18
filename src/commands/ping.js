const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping pong.");

const execute = async({ interaction, client }) => {
    const msg = await interaction.reply({ content: "Ping?", ephemeral: false, fetchReply: true });
    const diff = msg.createdTimestamp - interaction.createdTimestamp;
    const ping = Math.round(client.ws.ping);

    return interaction.editReply(`Pong! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
};

module.exports = {
    data,
    execute,
};