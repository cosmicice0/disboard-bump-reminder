const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
    .setName("config")
    .setDescription("Set/View the current configuration in this server.")
    .addSubcommand(subcommand =>
        subcommand
            .setName("show")
            .setDescription("Shows the current configuration for this server.")
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("set")
            .setDescription("Sets the configuration for this server.")
            .addRoleOption(option => option.setName("role").setDescription("The role for the bot to use.").setRequired(true))
            .addChannelOption(option => option.setName("channel").setDescription("The channel for the bot to use.").setRequired(true))
            .addStringOption(option => option.setName("message").setDescription("The message for the bump reminder.").setRequired(false))
    )
    .setDMPermission(false);

const execute = async({ interaction, db }) => {
    if (interaction.options.getSubcommand() === "show") {
        if (!db.server.get(interaction.guild.id)) { return interaction.reply({ content: "This server has not been configured yet.", }) }
        else {
            const config = db.server.get(interaction.guild.id);
            const embed = new EmbedBuilder()
                .setColor(0xFFFFFF)
                .setTitle("Current Configuration")
                .addFields(
                    { name: "Channel", value: `<#${config.channel}>`, inline: true },
                    { name: "Role", value: interaction.guild.roles.cache.find(role => role.id == config.role).name, inline: true },
                );

            if (config.message !== "Bump.") embed.addFields({ name: "Message", value: config.message });

            return interaction.reply({
                embeds: [embed]
            });
        }
    } else if (interaction.options.getSubcommand() === "set") {
        if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild))
            return interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true
            });

        const role = interaction.options.getRole("role");
        const channel = interaction.options.getChannel("channel");
        const message = interaction.options.getString("message") ? interaction.options.getString("message") : "Bump.";

        const embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setFooter({
                text: `Performed by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        if (channel.type !== 0) return interaction.reply({
            content: "The channel must be a text channel.",
            ephemeral: true
        });

        if (!db.server.get(interaction.guild.id)) {
            try {
                db.server.init(interaction.guild.id);
                db.server.update(interaction.guild.id, {
                    role: role.id,
                    channel: channel.id,
                    message: message,
                });

                embed
                    .setTitle("Configuration saved")
                    .setDescription("The configuration for this server has been added.")
                    .addFields(
                        { name: "Channel", value: `<#${channel.id}>`, inline: true },
                        { name: "Role", value: role.name, inline: true },
                    );

                if (message !== "Bump.") embed.addFields({ name: "Message", value: message });

                return interaction.reply({
                    embeds: [embed]
                });
            } catch (err) {
                console.log(err);
                return interaction.reply({
                    content: "An error occurred while saving the configuration.",
                    ephemeral: true
                });
            };
        } else {
            const existingConfig = db.server.get(interaction.guild.id);

            try {
                db.server.update(interaction.guild.id, {
                    role: role.id,
                    channel: channel.id,
                    message: message,
                });

                if (existingConfig.channel == channel.id && existingConfig.role == role.id && existingConfig.message == message) {
                    embed
                        .setTitle("Configuration unchanged.")
                        .setDescription("No changes were made to the configuration as it's the same as the current configuration.");

                    return interaction.reply({
                        embeds: [embed]
                    });
                }

                embed
                    .setTitle("Configuration updated")
                    .setDescription("The following changes were made to the configuration.");

                if (existingConfig.channel !== channel.id) embed.addFields({ name: "Channel", value: `<#${existingConfig.channel}> → <#${channel.id}>`, inline: true });
                if (existingConfig.role !== role.id) embed.addFields({ name: "Role", value: interaction.guild.roles.cache.find(role => role.id == existingConfig.role).name + ` → ${role.name}`, inline: true });
                if (existingConfig.message !== message) embed.addFields({ name: "Message", value: existingConfig.message + ` → ${message}` });

                return interaction.reply({
                    embeds: [embed]
                });
            } catch (err) {
                console.log(err);
                return interaction.reply({
                    content: "An error occurred while saving the configuration.",
                    ephemeral: true
                });
            };
        };
    };
};

module.exports = {
    data,
    execute,
};