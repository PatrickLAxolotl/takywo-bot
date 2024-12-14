console.log("🚀 Le bot essaie de démarrer...");

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const bot = new Client({
    intents: [GatewayIntentBits.Guilds]
});

bot.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.data.name, command);
}

bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Une erreur est survenue lors de l’exécution de cette commande.', ephemeral: true });
    }
});
console.log("🔧 Le bot démarre...");

bot.once('ready', () => {
    console.log(`${bot.user.tag} est connecté et prêt !`);
});

bot.login(config.token);
