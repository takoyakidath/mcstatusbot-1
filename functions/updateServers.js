'use strict';
import 'dotenv/config';
import { beaver } from './consoleLogging.js';
import { getServers } from './databaseFunctions.js';
import { getServerStatus } from './getServerStatus.js';
import { renameChannels } from './renameChannels.js';

function handleUpdateError(error, ip, guild) {
	if (!ip.includes('_')) {
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
}

export async function updateServers(client) {
	// Update server count badge on remote
	if (process.env.NODE_ENV == 'production' && client.cluster.id == 0) {
		try {
			let serverCountByShard = await client.cluster.fetchClientValues('guilds.cache.size');
			let serverCount = serverCountByShard.reduce((totalGuilds, shardGuilds) => totalGuilds + shardGuilds, 0);

			await fetch(process.env.DELEGATE_URL + '/count/set', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ count: serverCount, token: process.env.DELEGATE_TOKEN })
			});
		} catch (error) {
			if (error.name != 'Error [ShardingInProcess]') {
				beaver.log('update-servers', 'Error updating server count badge on remote', error);
			}
		}
	}

	await Promise.allSettled(
		client.guilds.cache.map(async (guild) => {
			let serverList = await getServers(guild.id);

			await Promise.allSettled(
				serverList.map(async (server) => {
					let serverStatus;

					try {
						serverStatus = await getServerStatus(server);
					} catch (error) {
						handleUpdateError(error, server.ip, guild.id);
					}

					const channels = [
						{ object: await guild.channels.cache.get(server.statusId), type: 'status' },
						{ object: await guild.channels.cache.get(server.playersId), type: 'players' }
					];

					await renameChannels(channels, serverStatus, 'low_priority');
				})
			);
		})
	);
}
