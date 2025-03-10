'use strict';
import { getServers } from './databaseFunctions.js';

export async function findServer(query, fields, guildId) {
	const monitoredServers = await getServers(guildId);
	let match;

	for (const field of fields) {
		match = monitoredServers.find((server) => server[field]?.toLowerCase() == query?.toLowerCase());
		if (match) break;
	}

	return match;
}

export async function findDefaultServer(guildId) {
	const monitoredServers = await getServers(guildId);
	return monitoredServers.find((server) => server.default) || monitoredServers[0];
}

export async function findServerIndex(query, guildId) {
	const monitoredServers = await getServers(guildId);
	return monitoredServers.findIndex((server) => server.ip == query.ip);
}
