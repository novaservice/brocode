const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banuje użytkownika.')
        .addUserOption(o => o
            .setName('użytkownik')
            .setDescription('Użytkownik, którego chcesz zbanować.')
            .setRequired(true))
        .addStringOption(o => o
            .setName('powód')
            .setDescription('Powód, dla którego chcesz zbanować użytkownika.')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),

    run: async (interaction, client) => {

        const user = interaction.options.getUser('użytkownik');
        const reason = interaction.options.getString('powód') || 'Nie podano powodu.';

        if (user.bot || user.id == interaction.member.id) return interaction.reply({ content: 'Nie możesz zbanować bota ani siebie.' })

        const member = await interaction.guild.members.fetch(user.id);
        if (!client.checkHighest(interaction.member, member, PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'Nie możesz zbanować tego użytkownika!', ephemeral: true });
        }

        await interaction.guild.members.ban(user, { reason: reason });
        await interaction.reply({ embeds: [
            new EmbedBuilder()
                .setDescription(`\💀 Użytkownik **${user.username + '#' + user.discriminator}** został zbanowany!
> Powód: ${reason}`)
                .setColor('#ff0000')
        ] });

    }


} // Fully made by skayvs