'use strict';
import { SlashCommandBuilder } from 'discord.js';
import { sendMessage } from '../functions/sendMessage.js';
import { descriptionLocalizations, messageLocalizations, nameLocalizations } from '../localizations/bug.js';

// prettier-ignore
export const data = new SlashCommandBuilder()
	.setName('bug')
    .setNameLocalizations(nameLocalizations)
	.setDescription('Send a bug report to maintainers')
    .setDescriptionLocalizations(descriptionLocalizations);

export async function execute(interaction) {
	await sendMessage(
		interaction,
		messageLocalizations[interaction.locale] ??
			'Report a bug by opening an issue in our [GitHub repository](https://github.com/RahulR100/mcstatusbot/issues).'
	);
}
