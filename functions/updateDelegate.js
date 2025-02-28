import 'dotenv/config';
import { beaver } from './consoleLogging.js';

// Update server count badge on remote
export async function updateDelegate(client) {
    // Update badge count if first client
    if (client.cluster.id == 0) {
		try {
			const serverCountByShard = await client.cluster.fetchClientValues('guilds.cache.size');
			const serverCount = serverCountByShard.reduce((totalGuilds, shardGuilds) => totalGuilds + shardGuilds, 0);

			await fetch(process.env.DELEGATE_URL + '/count/set', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ count: serverCount, token: process.env.DELEGATE_TOKEN })
			});
		} catch (error) {
			beaver.log('update-badge', 'Error updating server count badge on remote', error);
		}
    }

    // Update shard health for all clients (simple boolean true => up, false => down)
    try {
        const shardHealth = await client.cluster.broadcastEval(() => true);
        await fetch(process.env.DELEGATE_URL + '/shardHealth/set', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ health: shardHealth, token: process.env.DELEGATE_TOKEN })
        });
    } catch (error) {
        beaver.log('update-shard-health', 'Error updating shard health on remote', error);
    }
}
