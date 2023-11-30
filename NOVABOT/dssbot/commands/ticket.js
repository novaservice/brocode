const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Tworzy panel do ticketów.')
        .addChannelOption(o => o
            .setName('kanał')
            .setDescription('Kanał, na którym będą wysyłane wiadomości o ticketach.')
            .setRequired(true))
        .addStringOption(o => o
            .setName('wiadomość')
            .setDescription('Wiadomość, która będzie użyta w embedzie.')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    run: async (interaction, client) => {

        const channel = interaction.options.getChannel('kanał');
        const message = interaction.options.getString('wiadomość');
        const categories = client.config.ticketCategories

        await channel.send({ embeds: [
            new EmbedBuilder()
                .setTitle('Ticket')
                .setDescription(message)
                .setColor('#00ff00')
        ], components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(categories[0] + '_ticket')
                    .setLabel(categories[0])
                    .setStyle(1),
                new ButtonBuilder()
                    .setCustomId(categories[1] + '_ticket')
                    .setLabel(categories[1])
                    .setStyle(2),
                new ButtonBuilder()
                    .setCustomId(categories[2] + '_ticket')
                    .setLabel(categories[2])
                    .setStyle(3),
                new ButtonBuilder()
                    .setCustomId(categories[3] + '_ticket')
                    .setLabel(categories[3])
                    .setStyle(4)
            )
        ] })

        await interaction.reply({ content: 'Panel ticketów został ustawiony!', ephemeral: true });

    }

} // Fully made by skayvs