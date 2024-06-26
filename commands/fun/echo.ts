import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!").addStringOption((option) => option.setName("input").setDescription("The input to echo").setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		const input = interaction.options.getString("input", true);
		await interaction.reply(input);
	}
};
