import fs from "fs";
import path from "path";
import { load } from "ts-dotenv";
import { AutocompleteInteraction, ChatInputCommandInteraction, Client, Collection, Events, GatewayIntentBits, Interaction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

// Load environment variables
const env = load({
	DISCORD_BOT_TOKEN: String,
	CLIENT_ID: String
});

interface Command {
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	execute(interaction: ChatInputCommandInteraction): Promise<void>;
	autocomplete?(interaction: AutocompleteInteraction): Promise<void>;
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create a collection for your commands
const commands = new Collection<string, Command>();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		import(filePath)
			.then((command) => {
				if ("data" in command && "execute" in command) {
					commands.set(command.data.name, command);
				} else {
					console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
				}
			})
			.catch((err) => console.error(`Error loading command ${file}: ${err}`));
	}
}

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
	if (interaction.isChatInputCommand()) {
		const command = commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
			} else {
				await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
			}
		}
	} else if (interaction.isAutocomplete()) {
		const command = commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			if (!command.autocomplete) {
				console.error(`No autocomplete function found for command ${interaction.commandName}.`);
				return;
			}

			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error);
		}
	}
});

client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(env["DISCORD_BOT_TOKEN"]);
