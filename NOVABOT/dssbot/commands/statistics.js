const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('statystyki')
        .setDescription('Komendy do statystyk.')
        .addSubcommand(subcommand => subcommand
            .setName('reload')
            .setDescription('Odświeża statystyki na serwerze.'))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    run: async (interaction, client) => {

        const subcommand = interaction.options.getSubcommand();
        if (subcommand == 'reload') {

            await interaction.guild.members.fetch();
            await interaction.guild.bans.fetch()

            const members = interaction.guild.members.cache.filter(member => !member.user.bot).size;
            const bans = interaction.guild.bans.cache.map(ban => ban.user.id);

            client.newest = client.newest || interaction.guild.members.cache.last();
            const stats = client.config.stats;
            const values = [
                members,
                `${client.newest.user.username + '#' + client.newest.user.discriminator}`,
                bans.length
            ]

            stats.forEach(async (stat, index) => {

                const { id, name } = stat;
                const channel = await interaction.guild.channels.fetch(id);
                
                console.log(name.replace('<>', values[index]))
                channel.setName(`${name.replace('<>', values[index])}`).catch(err => console.log(err))

            })

            await interaction.reply({ content: 'Odświeżono statystyki!', ephemeral: true });

        }

    }


} // Fully made by skayvs