const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const packageJson = require("../../package.json");

const data = new SlashCommandBuilder()
    .setName("about")
    .setDescription("About the bot.");

const execute = async({ interaction }) => {
    const packageNames = Object.keys(packageJson.dependencies);
    const packageVersions = Object.values(packageJson.dependencies);

    let packages = packageNames.map((name, index) => `${name}: ${packageVersions[index]}`);

    const embed = new EmbedBuilder()
        .setTitle("About")
        .setDescription("This is a simple discord.js based bot used to remind members to bump the server on disboard. You can view the source code [here](https://github.com/cosmicice0/disboard-bump-reminder).")
        .addFields(
            { name: "Version", value: packageJson.version, inline: true },
            { name: "Dependencies", value: packages.join("\n"), inline: true }
        )
        .setColor(0xFFFFFF)
        .setFooter({
            iconURL: "https://cdn.discordapp.com/avatars/602588112174055436/be436961c7bc33e656c4a7f14a651797.png",
            text: "Made by cosmicice."
        });

    return interaction.reply({
        embeds: [embed]
    });
};

module.exports = {
    data,
    execute,
};