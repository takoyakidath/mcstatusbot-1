'use strict';
import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { isMissingPermissions } from '../functions/botPermissions.js';
import { beaver } from '../functions/consoleLogging.js';
import { addServer, getServers, setServers } from '../functions/databaseFunctions.js';
import { findDefaultServer, findServerIndex } from '../functions/findServer.js';
import { getServerStatus } from '../functions/getServerStatus.js';
import { isMonitored, isNicknameUsed, isValidServer, noMonitoredServers } from '../functions/inputValidation.js';
import { renameChannels } from '../functions/renameChannels.js';
import { sendMessage } from '../functions/sendMessage.js';
import {
	IPAddressDescriptionLocalizations,
	IPAddressLocalizations,
	defaultDescriptionLocalizations,
	defaultLocalizations,
	descriptionLocalizations,
	errorMessageLocalizations,
	nameLocalizations,
	nicknameDescriptionLocalizations,
	nicknameLocalizations,
	platformDescriptionLocalizations,
	platformLocalizations,
	successMessageLocalizations
} from '../localizations/monitor.js';

// prettier-ignore
export const data = new SlashCommandBuilder()
	.setName('monitor')
    .setNameLocalizations(nameLocalizations)
	.setDescription('Create 2 voice channels that display the status of a Minecraft server')
    .setDescriptionLocalizations(descriptionLocalizations)
	.addStringOption((option) => option
		.setName('ip')
        .setNameLocalizations(IPAddressLocalizations)
		.setDescription('IP address')
        .setDescriptionLocalizations(IPAddressDescriptionLocalizations)
		.setRequired(true))
	.addStringOption((option) => option
		.setName('nickname')
        .setNameLocalizations(nicknameLocalizations)
		.setDescription('Server nickname')
        .setDescriptionLocalizations(nicknameDescriptionLocalizations)
		.setRequired(false))
	.addBooleanOption((option) => option
		.setName('default')
        .setNameLocalizations(defaultLocalizations)
		.setDescription('Set this server to be the default for all commands')
        .setDescriptionLocalizations(defaultDescriptionLocalizations)
		.setRequired(false))
	.addStringOption((option) => option
		.setName('platform')
        .setNameLocalizations(platformLocalizations)
		.setDescription('Server platform')
        .setDescriptionLocalizations(platformDescriptionLocalizations)
		.setRequired(false)
		.setChoices({ name: 'Java', value: 'java' }, { name: 'Bedrock', value: 'bedrock' })
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
	.setDMPermission(false);

export async function execute(interaction) {
	if (await isMissingPermissions('server', interaction.guild, interaction)) return;
	if (await isMonitored(interaction.options.getString('ip'), interaction.guildId, interaction)) return;
	if (await isNicknameUsed(interaction.options.getString('nickname'), interaction.guildId, interaction)) return;
	if (!(await isValidServer(interaction.options.getString('ip'), interaction))) return;

	// Unset the default server if the new server is to be the default
	if (interaction.options.getBoolean('default')) {
		let server = await findDefaultServer(interaction.guildId);
		let serverIndex = await findServerIndex(server, interaction.guildId);
		let monitoredServers = await getServers(interaction.guildId);

		if (monitoredServers.length > 0 && serverIndex >= 0) {
			monitoredServers[serverIndex].default = false;
		}

		await setServers(interaction.guildId, monitoredServers);
	}

	// Create the server object
	let server = {
		ip: interaction.options.getString('ip'),
		nickname: interaction.options.getString('nickname') || null,
		default: (await noMonitoredServers(interaction.guildId)) ? true : interaction.options.getBoolean('default') || false,
		platform: interaction.options.getString('platform') || 'java'
	};

	// Create the server category
	try {
		let category = await interaction.guild.channels.create({
			name: interaction.options.getString('nickname') || interaction.options.getString('ip'),
			type: ChannelType.GuildCategory,
			permissionOverwrites: [
				{
					id: interaction.guild.members.me,
					allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.ManageChannels]
				},
				{
					id: interaction.guild.roles.everyone,
					deny: [PermissionFlagsBits.Connect]
				}
			]
		});
		server.categoryId = category.id;
	} catch (error) {
		beaver.log('monitor', `Error creating category channel in guild: ${interaction.guildId}`, error);
		await sendMessage(
			interaction,
			errorMessageLocalizations[interaction.locale] ??
				'There was an error while creating the channels, please manually delete any channels that were created!'
		);
		return;
	}

	// Create the channels and add to category
	let voiceChannels = [
		{ idType: 'statusId', name: 'Status: Updating...' },
		{ idType: 'playersId', name: 'Players: Updating...' }
	];
	for (const voiceChannel of voiceChannels) {
		try {
			let channel = await interaction.guild.channels.create({
				name: voiceChannel.name,
				type: ChannelType.GuildVoice
			});
			server[voiceChannel.idType] = channel.id;
			await channel.setParent(server.categoryId);
		} catch (error) {
			const channelIds = ['categoryId', 'statusId', 'playersId'];
			await Promise.allSettled(
				channelIds.map(async (channelId) => {
					try {
						await interaction.guild.channels.cache.get(server[channelId])?.delete();
					} catch (error) {
						beaver.log(
							'monitor',
							'Error deleting channel while aborting monitor command',
							JSON.stringify({
								'Channel ID': server[channelId],
								'Guild ID': interaction.guildId,
								'Server IP': server.ip
							}),
							error
						);
					}
				})
			);
			beaver.log('monitor', `Error creating voice channel in guild: ${interaction.guildId}`, error);
			await sendMessage(
				interaction,
				errorMessageLocalizations[interaction.locale] ??
					'There was an error while creating the channels, please manually delete any channels that were created!'
			);
			return;
		}
	}

	// Add the server to the database
	await addServer(interaction.guildId, server);

	await sendMessage(
		interaction,
		interaction.options.getBoolean('default')
			? successMessageLocalizations[interaction.locale]?.default ?? 'Server successfully monitored and set as the default server!'
			: successMessageLocalizations[interaction.locale]?.notDefault ?? 'Server successfully monitored!'
	);

	// Get the server status and update the channels
	const serverStatus = await getServerStatus(server);
	const channels = [
		{ object: await interaction.guild.channels.cache.get(server.statusId), type: 'status' },
		{ object: await interaction.guild.channels.cache.get(server.playersId), type: 'players' }
	];
	await renameChannels(channels, serverStatus);
}
