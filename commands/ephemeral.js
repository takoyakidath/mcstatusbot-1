'use strict';
import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { setEphemeral } from '../functions/databaseFunctions.js';
import { sendMessage } from '../functions/sendMessage.js';

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('ephemeral')
    .setDescription('Enable or disable ephemeral responses for this server')
    .addBooleanOption((option) => option
        .setName('enabled')
        .setDescription('Enable or disable ephemeral responses')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts([InteractionContextType.Guild]);

export async function execute(interaction) {
	const ephemeral = interaction.options.getBoolean('enabled');

	await setEphemeral(interaction.guildId, ephemeral);

	await sendMessage(interaction, `Ephemeral responses are now ${ephemeral ? 'enabled' : 'disabled'}`);
}
