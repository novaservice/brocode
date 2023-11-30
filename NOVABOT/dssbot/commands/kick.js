const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Wyrzuca użytkownika z serwera.')
        .addUserOption(o => o
            .setName('użytkownik')
            .setDescription('Użytkownik, którego chcesz wyrzucić.')
            .setRequired(true))
        .addStringOption(o => o
            .setName('powód')
            .setDescription('Powód, dla którego chcesz wyrzucić użytkownika.')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),

    run: async (interaction, client) => {

        const user = interaction.options.getUser('użytkownik');
        const reason = interaction.options.getString('powód') || 'Nie podano powodu.';

        if (user.bot || user.id == interaction.member.id) return interaction.reply({ content: 'Nie możesz wyrzucić bota ani siebie.' })

        const member = await interaction.guild.members.fetch(user.id);
        if (!client.checkHighest(interaction.member, member, PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'Nie możesz wyrzucić tego użytkownika!', ephemeral: true });
        }

        await interaction.guild.members.kick(user, { reason: reason });
        await interaction.reply({ embeds: [
            new EmbedBuilder()
                .setDescription(`\👢 Użytkownik **${user.username + '#' + user.discriminator}** został wyrzucony!
> Powód: ${reason}`)
                .setColor('#ff0000')
        ] });
    }

} // Fully made by skayvs