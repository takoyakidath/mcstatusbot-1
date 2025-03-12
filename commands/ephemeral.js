'use strict';
import { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { setEphemeral } from '../functions/databaseFunctions.js';
import { sendMessage } from '../functions/sendMessage.js';
import {
	descriptionLocalizations,
	enabledDescriptionLocalizations,
	enabledOptionLocalizations,
	nameLocalizations,
	updatedLocalizations
} from '../localizations/ephemeral.js';

// prettier-ignore
export const data = new SlashCommandBuilder()
    .setName('ephemeral')
    .setNameLocalizations(nameLocalizations)
    .setDescription('Enable or disable ephemeral responses for this server')
    .setDescriptionLocalizations(descriptionLocalizations)
    .addBooleanOption((option) => option
        .setName('enabled')
        .setNameLocalizations(enabledOptionLocalizations)
        .setDescription('Enable or disable ephemeral responses')
        .setDescriptionLocalizations(enabledDescriptionLocalizations)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts([InteractionContextType.Guild]);

export async function execute(interaction) {
	const ephemeral = interaction.options.getBoolean('enabled');

	await setEphemeral(interaction.guildId, ephemeral);

	const locale = interaction.locale;

	if (locale) {
		await sendMessage(interaction, `${updatedLocalizations[locale][1]} ${ephemeral ? updatedLocalizations[locale][2] : updatedLocalizations[locale][3]}`);
		return;
	}

	await sendMessage(interaction, `Ephemeral responses are now ${ephemeral ? 'enabled' : 'disabled'}`);
}
