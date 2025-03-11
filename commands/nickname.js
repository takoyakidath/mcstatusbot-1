'use strict';
import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { isMissingPermissions } from '../functions/botPermissions.js';
import { beaver } from '../functions/consoleLogging.js';
import { findDefaultServer, findServer } from '../functions/findServer.js';
import { isNicknameUsed, isNotMonitored, noMonitoredServers } from '../functions/inputValidation.js';
import { sendMessage } from '../functions/sendMessage.js';
import {
	descriptionLocalizations,
	errorMessageLocalizations,
	nameLocalizations,
	nicknameDescriptionLocalizations,
	nicknameLocalizations,
	rateLimitErrorLocalizations,
	serverDescriptionLocalizations,
	serverLocalizations,
	successMessageLocalizations
} from '../localizations/nickname.js';

// prettier-ignore
export const data = new SlashCommandBuilder()
	.setName('nickname')
    .setNameLocalizations(nameLocalizations)
	.setDescription('Change the nickname of a monitored Minecraft server')
    .setDescriptionLocalizations(descriptionLocalizations)
	.addStringOption((option) => option
		.setName('nickname')
        .setNameLocalizations(nicknameLocalizations)
		.setDescription('Server nickname')
        .setDescriptionLocalizations(nicknameDescriptionLocalizations)
		.setRequired(true))
	.addStringOption((option) => option
		.setName('server')
        .setNameLocalizations(serverLocalizations)
		.setDescription('Server IP address or nickname')
        .setDescriptionLocalizations(serverDescriptionLocalizations)
		.setRequired(false))
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts([InteractionContextType.Guild]);

export async function execute(interaction) {
	if (await noMonitoredServers(interaction.guildId, interaction)) return;
	if (await isNicknameUsed(interaction.options.getString('nickname'), interaction.guildId, interaction)) return;

	let server;

	// Find the server to rename
	if (interaction.options.getString('server')) {
		server = await findServer(interaction.options.getString('server'), ['ip', 'nickname'], interaction.guildId);
		if (await isNotMonitored(server, interaction)) return;
	} else {
		server = await findDefaultServer(interaction.guildId);
	}

	if (await isMissingPermissions('category', interaction.guild.channels.cache.get(server.categoryId), interaction)) return;

	// Rename the server category
	try {
		let channel = await interaction.guild.channels.cache.get(server.categoryId);
		await channel?.setName(interaction.options.getString('nickname'));
	} catch (error) {
		if (error.name.includes('RateLimitError')) {
			await sendMessage(
				interaction,
				rateLimitErrorLocalizations[interaction.locale] ??
					'The rate limit for this channel has been reached, please try renaming this server in a few minutes!'
			);
		} else {
			beaver.log(
				'nickname',
				'Error renaming channel while setting nickname',
				JSON.stringify({
					'Channel ID': server.categoryId,
					'Guild ID': interaction.guildId
				}),
				error
			);
			await sendMessage(interaction, errorMessageLocalizations[interaction.locale] ?? 'There was an error while renaming the channel!');
		}
		return;
	}

	await sendMessage(
		interaction,
		successMessageLocalizations[interaction.locale] ??
			"The server has successfully been renamed. It might take a few seconds to show up due to Discord's API limitations."
	);
}
