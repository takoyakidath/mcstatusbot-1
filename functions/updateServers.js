'use strict';
import 'dotenv/config';
import { beaver } from './consoleLogging.js';
import { getServers } from './databaseFunctions.js';
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

export async function updateServers(client) {
	await Promise.allSettled(
		client.guilds.cache.map(async (guild) => {
			let serverList = await getServers(guild.id);

			await Promise.allSettled(
				serverList.map(async (server) => {
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

					const channels = [
						{ object: await guild.channels.cache.get(server.statusId), type: 'status' },
						{ object: await guild.channels.cache.get(server.playersId), type: 'players' }
					];

					await renameChannels(channels, serverStatus, 'low_priority', serverError);
				})
			);
		})
	);
}
