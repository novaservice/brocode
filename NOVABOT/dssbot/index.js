const { Client, IntentsBitField, Collection } = require('discord.js');
const { TOKEN } = require('./config.json');
const fs = require('fs');

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildBans
] });

client.commands = new Collection();
client.config = require('./config.json');
client.newest = null;

client.once('ready', async () => {
    fs.readdirSync('./handlers').forEach(async handler => { await require(__dirname + `/handlers/${handler}`)(client) })
    console.log('Ready!');
});

// Fully made by skayvs
client.login(TOKEN)