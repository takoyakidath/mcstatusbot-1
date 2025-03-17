'use strict';
import { Collection, Events, InteractionContextType, MessageFlags } from 'discord.js';
import { beaver } from '../functions/consoleLogging.js';
import { cooldownErrorLocalizations, errorMessageLocalizations } from '../localizations/interactionCreate.js';
import { getEphemeral } from '../functions/databaseFunctions.js';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction) {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return;

	// If the command was executed from a guild, check if the guild has ephemeral responses enabled
	// All DM messages are ephemeral by default
	let ephemeral = true;
	if (interaction.context == InteractionContextType.Guild) {
		ephemeral = await getEphemeral(interaction.guildId);
	}

	// Defer the reply to the interaction
	try {
		ephemeral ? await interaction.deferReply({ flags: MessageFlags.Ephemeral }) : await interaction.deferReply();
		if (!interaction.deferred) throw new Error('Interaction was not deferred');
	} catch (error) {
		const commandOptions = getCommandOptions(interaction);

		beaver.log(
			'interaction-create',
			'Error deferring reply to command',
			JSON.stringify({
				'Guild ID': interaction.guildId,
				'Command Name': interaction.commandName,
				'Command Options': commandOptions || 'None'
			}),
			error
		);

		return;
	}

	// Check to see if the user is on cooldown
	const { cooldowns } = interaction.client;

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const cooldownAmount = 3; // 3 seconds cooldown

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount * 1000;

		if (now < expirationTime) {
			const localizedError = cooldownErrorLocalizations[interaction.locale];

			if (localizedError) {
				const reply = { content: `${localizedError[1]} ${cooldownAmount} ${localizedError[2]}` };
				if (ephemeral) reply.flags = MessageFlags.Ephemeral;

				await interaction.editReply(reply);
			} else {
				const reply = { content: `Please wait. You are on cooldown for ${cooldownAmount} seconds.` };
				if (ephemeral) reply.flags = MessageFlags.Ephemeral;

				await interaction.editReply(reply);
			}

			return;
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount * 1000);

	// Now execute the command
	try {
		await command.execute(interaction);
	} catch (error) {
		const commandOptions = getCommandOptions(interaction);

		beaver.log(
			'interaction-create',
			'Error executing command',
			JSON.stringify({
				'Guild ID': interaction.guildId,
				'Command Name': interaction.commandName,
				'Command Options': commandOptions || 'None'
			}),
			error
		);

		const reply = {
			content:
				errorMessageLocalizations[interaction.locale] ??
				'There was an error while executing this command! Please try again in a few minutes. If the problem persists, please open an issue on GitHub.'
		};
		if (ephemeral) reply.flags = MessageFlags.Ephemeral;

		await interaction.editReply(reply);
	}
}

function getCommandOptions(interaction) {
	const commandOptions = interaction.options.data.map((option) => ({ name: option.name, value: option.value }));
	return commandOptions.length ? commandOptions : null;
}
