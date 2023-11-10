# gpt-discord-js

Simplisitc GPT-4 Discord Chat Bot for your Server.

Create a `.env` file and add the following:
```
TOKEN=""
OPENAI_API_KEY="sk-..."
GUILD_IDS='69', '420'
CLIENT_ID="123456..."
```
`TOKEN` is your discord bot token (found in discord dev portal)
`OPENAI_API_KEY` can we found on the OpenAI API website
`GUILD_IDS` are the IDs of the servers you'd like to add to the bot permissions, you first need to navigate to 'advanced' in your discord settings and make sure developer tools is turned on. Then right click on your server badge and click 'Copy Server ID'. This is the guild ID for your server. Add as many servers (guilds) as you'd like to this env variable.
`CLIENT_ID` can be found in your bot setting in the dev portal

Run the following:
`touch conversation-logs.jsonl`
`npm install`
`npm start`

Use `/prompt` to interact with your new bot