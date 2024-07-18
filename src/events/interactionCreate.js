const { Events } = require('discord.js');
const db = require("../../lib/db");

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return console.error(`Command "${interaction.commandName}" was not found.`);

        try {
            await command.execute({
                interaction: interaction,
                client: interaction.client,
                db: db
            });
        } catch (err) {
            console.error(err);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "Something went wrong while executing this command...",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: "Something went wrong while executing this command...",
                    ephemeral: true,
                });
            };
        };
	},
};
