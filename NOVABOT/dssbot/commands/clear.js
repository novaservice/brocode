const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Usuwa wiadomości.')
        .addIntegerOption(o => o
            .setName('ilość')
            .setDescription('Ilość wiadomości do usunięcia.')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

    run: async (interaction, client) => {

        const amount = interaction.options.getInteger('ilość');

        if (amount > 100) return interaction.reply({ content: 'Nie możesz usunąć więcej niż 100 wiadomości!', ephemeral: true });

        await interaction.channel.bulkDelete(amount + 1);
        await interaction.reply({ embeds: [
            new EmbedBuilder()
                .setDescription(`\🗑 Usunięto ${amount} wiadomości!`)
                .setColor('#ff0000')
        ] });

    }

} // Fully made by skayvs