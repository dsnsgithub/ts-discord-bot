# Generic Typescript Discord Bot (discord.js)

A template for more advanced discord bots.
- Slash commands, ts-dotenv for typescript enviroment variables.
- Requires ts-node to be installed globally

### 2. Enter the repository and install dependencies:

	cd typescript-discord-bot
	npm install

### 3. Create a `.env` file and add these properties:

	DISCORD_BOT_TOKEN = [create a discord bot in the developer portal and add the token here]
	CLIENT_ID = [discord bot client id, found in discord developer portal] 
	GUILD_ID = [id from guild where you want to log/send chat messages]

### 4. Register Discord Slash Commands:

    ts-node deploy-commands.ts

### 5. Run the Discord Bot:

    ts-node .