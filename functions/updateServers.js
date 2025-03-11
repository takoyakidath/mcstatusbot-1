'use strict';
import 'dotenv/config';
import { beaver } from './consoleLogging.js';
import { getIndicators, getServers } from './databaseFunctions.js';
import { getServerStatus } from './getServerStatus.js';
import { renameChannels } from './renameChannels.js';

function handleUpdateError(error, ip, guild) {
	beaver.log(
		'update-servers',
		'Error pinging Minecraft server while updating servers',
		JSON.stringify({
			'Server IP': ip,
			'Guild ID': guild
		}),
		error
	);
}

async function mapWithDelay(array, callback, delay) {
	const results = [];
	for (const item of array) {
		results.push(await callback(item));
		await new Promise((resolve) => setTimeout(resolve, delay));
	}
	return results;
}

export async function updateServers(client) {
	await Promise.allSettled(
		client.guilds.cache.map(async (guild) => {
			let serverList = await getServers(guild.id);

			await Promise.allSettled(
				mapWithDelay(
					serverList,
					async (server) => {
						let serverStatus;
						let serverError;

						try {
							serverStatus = await getServerStatus(server, 'low_priority');
						} catch (error) {
							if (error.message == 'Invalid server IP') {
								serverError = 'Invalid IP Address';
							} else {
								handleUpdateError(error, server.ip, guild.id);
							}
						}

						if (!serverStatus && !serverError) return;

						const channels = [
							{ object: await guild.channels.cache.get(server.statusId), type: 'status' },
							{ object: await guild.channels.cache.get(server.playersId), type: 'players' }
						];

						const indicators = await getIndicators(guild.id, server);

						await renameChannels(channels, serverStatus, indicators, 'low_priority', serverError);
					},
					10
				)
			);
		})
	);
}
