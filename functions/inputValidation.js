'use strict';
import {
	alreadyDefaultServerLocalizations,
	alreadyMonitoredLocalizations,
	alreadyMonitoredNicknameLocalizations,
	alreadyUsedNicknameIPLocalizations,
	alreadyUsedNicknameLocalizations,
	invalidServerLocalizations,
	multipleMonitoredServersLocalizations,
	noMonitoredServersLocalizations,
	notMonitoredLocalizations,
	removingDefaultServerLocalizations,
	restrictedKeywordLocalizations,
	restrictedKeywordNicknameLocalizations
} from '../localizations/inputValidation.js';
import { numberOfServers } from './databaseFunctions.js';
import { findDefaultServer, findServer } from './findServer.js';
import { sendMessage } from './sendMessage.js';
import { validateHost } from './validateHost.js';

const reservedNames = ['all'];

export async function noMonitoredServers(guildId, interaction, isStatusCommand) {
	if ((await numberOfServers(guildId)) == 0) {
		if (interaction) {
			const localizedError = noMonitoredServersLocalizations[interaction.locale];

			if (localizedError) {
				await sendMessage(interaction, `${localizedError[1]}${isStatusCommand ? localizedError[2] : '!'}`);
			} else {
				await sendMessage(interaction, `There are no monitored servers${isStatusCommand ? ' and no IP address was specified!' : '!'}`);
			}
		}
		return true;
	}

	return false;
}

export async function isDefault(server, guildId, interaction) {
	let defaultServer = await findDefaultServer(guildId);

	if (server.ip == defaultServer.ip) {
		interaction && (await sendMessage(interaction, alreadyDefaultServerLocalizations[interaction.locale] ?? 'This server is already the default server!'));
		return true;
	}

	return false;
}

export async function isMonitored(ip, guildId, interaction) {
	let server = await findServer(ip, ['ip'], guildId);
	if (server) {
		interaction && (await sendMessage(interaction, alreadyMonitoredLocalizations[interaction.locale] ?? 'This IP address is already being monitored!'));
		return true;
	}

	server = await findServer(ip, ['nickname'], guildId);
	if (server) {
		interaction &&
			(await sendMessage(
				interaction,
				alreadyMonitoredNicknameLocalizations[interaction.locale] ??
					'This IP address is the nickname of another server that is already being monitored!'
			));
		return true;
	}

	if (reservedNames.includes(ip)) {
		interaction && (await sendMessage(interaction, restrictedKeywordLocalizations[interaction.locale] ?? 'This IP address is a restricted keyword!'));
		return true;
	}

	return false;
}

export async function isNotMonitored(server, interaction) {
	if (!server) {
		interaction && (await sendMessage(interaction, notMonitoredLocalizations[interaction.locale] ?? 'This server is not being monitored!'));
		return true;
	}

	return false;
}

export async function isNicknameUsed(nickname, guildId, interaction) {
	let server = await findServer(nickname, ['nickname'], guildId);
	if (nickname && server) {
		interaction && (await sendMessage(interaction, alreadyUsedNicknameLocalizations[interaction.locale] ?? 'This nickname is already being used!'));
		return true;
	}

	server = await findServer(nickname, ['ip'], guildId);
	if (nickname && server) {
		interaction &&
			(await sendMessage(
				interaction,
				alreadyUsedNicknameIPLocalizations[interaction.locale] ?? 'This nickname is the IP address of another server that is already being monitored!'
			));
		return true;
	}

	if (reservedNames.includes(nickname)) {
		interaction && (await sendMessage(interaction, restrictedKeywordNicknameLocalizations[interaction.locale] ?? 'This nickname is a restricted keyword!'));
		return true;
	}

	return false;
}

export async function isServerUnspecified(server, guildId, interaction) {
	if (!server && (await multipleMonitoredServers(guildId))) {
		interaction &&
			(await sendMessage(
				interaction,
				multipleMonitoredServersLocalizations[interaction.locale] ??
					'There are multiple monitored servers, and no server was specified! Use `/unmonitor all` to unmonitor all servers.'
			));
		return true;
	}

	return false;
}

export async function removingDefaultServer(server, guildId, interaction) {
	if ((await multipleMonitoredServers(guildId)) && (await isDefault(server, guildId))) {
		interaction &&
			(await sendMessage(
				interaction,
				removingDefaultServerLocalizations[interaction.locale] ??
					'There are multiple monitored servers, and this server is the default server! Set another server to be the default server before unmonitoring this server, or use `/unmonitor all` to unmonitor all servers.'
			));
		return true;
	}

	return false;
}

export async function multipleMonitoredServers(guildId) {
	return (await numberOfServers(guildId)) > 1;
}

export async function isValidServer(server, interaction) {
	if (!validateHost(server)) {
		if (interaction) {
			const localizedError = invalidServerLocalizations[interaction.locale];

			if (localizedError) {
				await sendMessage(interaction, `${localizedError[1]} ${server.includes('_') ? localizedError[2] : ''}`);
			} else {
				await sendMessage(interaction, `This is not a valid IP address or domain name ${server.includes('_') ? '(underscores are not allowed)!' : ''}`);
			}
		}
		return false;
	}

	return true;
}
