'use strict';
import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { getServers, setOfflineIndicator, setOnlineIndicator } from '../functions/databaseFunctions.js';
import { sendMessage } from '../functions/sendMessage.js';
import { isNotMonitored, isValidIndicator, noMonitoredServers } from '../functions/inputValidation.js';
import { findDefaultServer, findServer } from '../functions/findServer.js';

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('indicators')
    .setDescription('Customise the online/offline indicators for a particular server')
    .addStringOption((option) => option
            .setName('server')
            .setDescription('Server IP address or nickname')
            .setRequired(true))
    .addStringOption((option) => option
            .setName('online')
            .setDescription('Online indicator')
            .setRequired(false))
    .addStringOption((option) => option
            .setName('offline')
            .setDescription('Offline indicator')
            .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts([InteractionContextType.Guild]);

export async function execute(interaction) {
	if (await noMonitoredServers(interaction.guildId, interaction)) return;

	const onlineIndicator = interaction.options.getString('online');
	const offlineIndicator = interaction.options.getString('offline');

	if (!onlineIndicator && !offlineIndicator) {
		await sendMessage(interaction, 'No indicators were provided! We will retain default indicators.');
		return;
	}

	// Make sure indicators are valid
	if (onlineIndicator && !(await isValidIndicator(onlineIndicator, interaction))) return;
	if (offlineIndicator && !(await isValidIndicator(offlineIndicator, interaction))) return;

	if (interaction.options.getString('server') == 'all') {
		let monitoredServers = await getServers(interaction.guild.id);

		await Promise.allSettled(
			monitoredServers.map(async (server) => {
				if (onlineIndicator) {
					setOnlineIndicator(interaction.guildId, server, onlineIndicator);
				}
				if (offlineIndicator) {
					setOfflineIndicator(interaction.guildId, server, offlineIndicator);
				}
			})
		);

		await sendMessage(
			interaction,
			'The online/offline indicators have been updated for all servers. The changes will be reflected with the next update, in about 5-6 minutes.'
		);

		return;
	}

	let server;

	// Find the server to rename
	if (interaction.options.getString('server')) {
		server = await findServer(interaction.options.getString('server'), ['ip', 'nickname'], interaction.guildId);
		if (await isNotMonitored(server, interaction)) return;
	} else {
		server = await findDefaultServer(interaction.guildId);
	}

	// Update the server's online and offline indicators, if provided
	if (onlineIndicator) {
		setOnlineIndicator(interaction.guildId, server, onlineIndicator);
	}
	if (offlineIndicator) {
		setOfflineIndicator(interaction.guildId, server, offlineIndicator);
	}

	await sendMessage(
		interaction,
		`The online/offline indicators have been updated for ${server.ip}. The changes will be reflected with the next update, in about 5-6 minutes.`
	);
}
