const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try { await command(interaction, client) } catch (e) {
                console.log(e)
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === 'verify') {

                const member = interaction.member;
                const role = await interaction.guild.roles.fetch(client.config.verifyRole)
                await member.roles.add(role);
                await interaction.reply({ content: 'Zostałeś zweryfikowany!', ephemeral: true });

            } else if (interaction.customId.endsWith('_ticket')) {

                const category = interaction.customId.split('_')[0];
                const channel = await interaction.guild.channels.create({
                    name: `${category}-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    parent: client.config.ticketCategory,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: client.config.ticketRole,
                            allow: [PermissionFlagsBits.ViewChannel]
                        }
                    ],
                }).then(channel => channel.setTopic(`${interaction.user.id}`))
                await channel.send({ content: `<@${interaction.user.id}>`, embeds: [
                    new EmbedBuilder()
                        .setTitle('Ticket: ' + category)
                        .setDescription('Witaj! Tutaj możesz porozmawiać z administracją. Aby zamknąć ticket, naciśnij przycisk poniżej.')
                        .setColor('#00ff00')
                ], components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('ticketclose')
                            .setLabel('Zamknij ticket')
                            .setStyle(4)
                    )
                ] })
                await interaction.reply({ content: 'Twój ticket został otwarty!', ephemeral: true });

            } else if (interaction.customId === 'ticketclose') {

                if (interaction.channel.parentId !== client.config.ticketCategory) return;

                const transcript = await discordTranscripts.createTranscript(interaction.channel, {
                    filename: `${interaction.channel.name}.html`,
                    limit: -1,
                    saveImages: true,
                    poweredBy: false
                })
                await interaction.channel.delete();

                const channel = await interaction.guild.channels.fetch(client.config.ticketLog);
                await channel.send({ embeds: [
                    new EmbedBuilder()
                        .setTitle('Ticket został zamknięty')
                        .setDescription(`Ticket został zamknięty przez <@${interaction.user.id}>.
Aby otworzyć transkrypt, pobierz plik i otwórz go **w przeglądarce**.`)
                        .setColor('#00ff00')
                ], files: [transcript] })

            } else if (interaction.customId.startsWith('rr')) {

                const role = await interaction.guild.roles.fetch(interaction.customId.split('rr')[1]);
                await interaction.member.roles.add(role);
                await interaction.reply({ content: `Otrzymałeś rolę ${role.name}!`, ephemeral: true });

            }
        }

    }
} // Fully made by skayvs