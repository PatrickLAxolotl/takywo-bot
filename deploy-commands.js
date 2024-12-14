const { REST, Routes } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log('🔄 Enregistrement des commandes...');
        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands }
        );
        console.log('✔️ Commandes enregistrées avec succès.');
    } catch (error) {
        console.error('❌ Erreur lors de l’enregistrement des commandes :', error);
    }
})();
