export const nameLocalizations = {
	de: 'hilfe'
};

export const descriptionLocalizations = {
	de: 'Liste die anderen Befehle auf'
};

export const commandTitleLocalizations = {
	de: 'Befehle:'
};

export const listLocalizations = {
	de: [
		{
			name: '/status [server|ip]',
			value: 'Zeigt den aktuellen Status und die aktiven Spieler für jeden Server an'
		},
		{
			name: '/monitor ip [nickname] [default (true/false)]',
			value: 'Erstellt 2 Sprachkanäle, die den Status eines Minecraft-Servers anzeigen und optional einen Spitznamen setzen'
		},
		{
			name: '/nickname nickname [server]',
			value: 'Ändert den Spitznamen eines überw achten Minecraft-Servers'
		},
		{
			name: '/default [server]',
			value: 'Legt einen Server fest, der für alle Befehle standardmäßig verwendet wird'
		},
		{
			name: '/unmonitor [server|all]',
			value: 'Überwacht den angegebenen Server oder alle Server nicht mehr'
		},
		{
			name: '/bug',
			value: 'Senden Sie einen Fehlerbericht an die Betreuer'
		}
	]
};
