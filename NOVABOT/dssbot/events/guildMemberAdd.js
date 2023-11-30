module.exports = {
    name: 'guildMemberAdd',

    run: async (member, client) => {

        client.newest = member;
        client.config.autoRole.forEach(async role => {
            const rolex = await member.guild.roles.fetch(role);
            if (!rolex) return;
            await member.roles.add(rolex);
        })

    }

} // Fully made by skayvs