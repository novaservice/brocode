module.exports = async (client) => {
    const guild = await client.guilds.fetch(client.config.rootGuild);

    setInterval(async () => {
        
        await guild.members.fetch();
        await guild.bans.fetch()

        const members = guild.members.cache.filter(member => !member.user.bot).size;
        const bans = guild.bans.cache.map(ban => ban.user.id);

        client.newest = client.newest || guild.members.cache.last();
        const stats = client.config.stats;

        const values = [
            members,
            `${client.newest.user.username + '#' + client.newest.user.discriminator}`,
            bans.length
        ]

        stats.forEach(async (stat, index) => {
                
            const { id, name } = stat;
            const channel = await guild.channels.fetch(id);
            
            channel.setName(`${name.replace('<>', values[index])}`).catch(err => console.log(err))
    
        })


    }, 60000)

    setInterval(async () => {

        // mutes with better-sqlite3
        const mutes = client.db.prepare('SELECT * FROM mutes').all();
        const now = Date.now();

        mutes.forEach(async mute => {
                
            if (mute.time < now) {

                const member = await guild.members.fetch(mute.member.replace('KURWA', ''));

                const role = await guild.roles.fetch(client.config.muteRole.toString());
                await member.roles.remove(role);

                client.db.prepare('DELETE FROM mutes WHERE member = ?').run(mute.member);

            }
    
        })


    }, 10000)

} // Fully made by skayvs