'use strict';
import 'dotenv/config';
import { ClusterManager, HeartbeatManager, ReClusterManager, fetchRecommendedShards } from 'discord-hybrid-sharding';
import { beaver } from './functions/consoleLogging.js';

const shardsPerClusters = parseInt(process.env.SPC);

let manager = new ClusterManager('./bot.js', {
	shardsPerClusters: shardsPerClusters,
	token: process.env.TOKEN,
	mode: 'process',
	restarts: {
		max: 5,
		interval: 24 * 60 * 60 * 1000
	}
});

manager.extend(new ReClusterManager());
manager.extend(
	new HeartbeatManager({
		interval: 12000,
		maxMissedHeartbeats: 5
	})
);

manager.on('clusterCreate', (cluster) => beaver.log('sharding', `Created cluster ${cluster.id}`));

async function spawnShards() {
	beaver.log('sharding', `Starting bot!`);
	await manager.spawn({timeout: -1});
	setInterval(reclusterShards, 24 * 60 * 60 * 1000);
}

async function reclusterShards() {
	try {
		const recommendedShards = await fetchRecommendedShards(process.env.TOKEN);
		if (recommendedShards != manager.totalShards) {
			beaver.log('sharding', `Reclustering from ${manager.totalShards} to ${recommendedShards} shards`);
			manager.recluster.start({
				restartMode: 'gracefulSwitch',
				totalShards: recommendedShards,
				shardsPerClusters: shardsPerClusters,
				shardList: null,
				shardClusterList: null,
                timeout: -1
			});
		}
	} catch (error) {
		beaver.log('sharding', error);
	}
}

try {
	spawnShards();
} catch (error) {
	beaver.log('sharding', error);
}
