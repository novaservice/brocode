const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Wycisza użytkownika.')
        .addUserOption(o => o
            .setName('użytkownik')
            .setDescription('Użytkownik, którego chcesz wyciszyć.')
            .setRequired(true))
        .addStringOption(o => o
            .setName('czas')
            .setDescription('Czas, na jaki chcesz wyciszyć użytkownika.')
            .setRequired(true))
        .addStringOption(o => o
            .setName('powód')
            .setDescription('Powód, dla którego chcesz wyciszyć użytkownika.')
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),

    run: async (interaction, client) => {

        const user = interaction.options.getUser('użytkownik');
        const time = interaction.options.getString('czas');
        const reason = interaction.options.getString('powód') || 'Nie podano powodu.';

        if (user.bot || user.id == interaction.member.id) return interaction.reply({ content: 'Nie możesz wyciszyć bota ani siebie.' })

        const member = await interaction.guild.members.fetch(user.id);
        if (!client.checkHighest(interaction.member, member, PermissionsBitField.Flags.MuteMembers)) {
            return interaction.reply({ content: 'Nie możesz wyciszyć tego użytkownika!', ephemeral: true });
        }

        if (
            client.db.prepare('SELECT * FROM mutes WHERE member = ?').get(user.id)
        ) return interaction.reply({ content: 'Ten użytkownik jest już wyciszony!', ephemeral: true });

        const muteRole = await interaction.guild.roles.fetch(client.config.muteRole);
        let muteTime
        try { muteTime = ms(time); } catch { return interaction.reply({ content: 'Podano nieprawidłowy czas!', ephemeral: true }); }

        client.db.prepare('INSERT INTO mutes (member, time) VALUES (?, ?)').run(`${user.id}KURWA`, Date.now() + muteTime);

        await member.roles.add(muteRole);
        await interaction.reply({ embeds: [
            new EmbedBuilder()
                .setDescription(`\🔇 Użytkownik **${user.username + '#' + user.discriminator}** został wyciszony!
> Czas: ${time}
> Powód: ${reason}`)
                .setColor('#ff0000')
        ] });

    }

} // Fully made by skayvs