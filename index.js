import { Client, GatewayIntentBits } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'fs';
import dotenv from 'dotenv';
import OpenAI from "openai";


// Initialize dotenv to use .env file for environment variables
dotenv.config();

// Initialize the OpenAI API
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

// Array of commands
const commands = [
    {
        name: 'prompt',
        description: 'Receives a prompt and responds.',
        options: [{
            type: 3,
            name: 'text',
            description: 'The input to echo back',
            required: true
        }]
    }
    // ... other commands
];

const rest = new REST({ version: '9' }).setToken(token);

await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands },
);

const guildIds = ['904260227187241050', '758424958681612340', '1159694424691970058']; // Array of guild IDs

guildIds.forEach(async (guildId) => {
    try {
        console.log(`Started refreshing application (/) commands for guild ${guildId}.`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded application (/) commands for guild ${guildId}.`);
    } catch (error) {
        console.error(error);
    }
});


(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

let message = [{ role: "system", content: "You are a helpful assistant whom also funnily boasts about their IQ of 169." }]

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'prompt') {
        // Immediately defer the reply
        await interaction.deferReply();

    
        // Get the input from the user
        const input = interaction.options.getString('text');
        message.push({ role: "user", content: input });


        try {
            const completion = await openai.chat.completions.create({
                messages: message,
                model: "gpt-4-1106-preview",
            });

            let response = completion.choices[0].message.content;
            message.push({ role: "assistant", content: response });

            // Edit the original deferred reply with the actual response
            await interaction.editReply(response);

            // Log the conversation to a file
            fs.appendFileSync('conversation-logs.jsonl', JSON.stringify({
                timestamp: new Date(),
                user: input,
                bot: response
            }) + '\n');

        } catch (error) {
            console.error('Error calling OpenAI:', error);
            await interaction.followUp({ content: 'Sorry, I encountered an error trying to respond to your prompt.', ephemeral: true });
        }
    }
});

// Login to Discord with your app's token
client.login(process.env.TOKEN);
