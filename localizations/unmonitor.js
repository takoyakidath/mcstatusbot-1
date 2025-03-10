// Must be lowercase and not contain any spaces
export const nameLocalizations = {
	da: 'unmonitor',
	de: 'unmonitor',
	'es-ES': 'unmonitor'
};

export const descriptionLocalizations = {
	da: 'Fjerner en overvåget Minecraft-server',
	de: 'Entfernen Sie einen überwachten Minecraft-Server',
	'es-ES': 'Elimina un servidor de Minecraft supervisado'
};

// Must be lowercase and not contain any spaces
export const serverLocalizations = {
	da: 'server',
	de: 'server',
	'es-ES': 'server'
};

export const serverDescriptionLocalizations = {
	da: 'Server-IP-adresse eller kaldenavn',
	de: 'Server-IP-Adresse oder Spitzname',
	'es-ES': 'Dirección IP del servidor o apodo'
};

export const channelsRemovedLocalizations = {
	da: 'Alle kanaler til denne server blev fjernet!',
	de: 'Alle Kanäle für diesen Server wurden entfernt!',
	'es-ES': '¡Todos los canales para este servidor fueron eliminados!'
};

export const errorMessageLocalizations = {
	da: {
		default: 'Der opstod en fejl under fjernelsen af serveren!',
		notUnmonitored: 'Følgende servere kræver de nødvendige kategori- og/eller kanalrettigheder, før du kan fjerne overvågningen',
		notDeleted: 'Følgende servere blev ikke overvåget, og kanalerne skal fjernes manuelt'
	},
	de: {
		default: 'Beim Entfernen des Servers ist ein Fehler aufgetreten!',
		notUnmonitored: 'Die folgenden Server benötigen die erforderlichen Kategorie- und/oder Kanalberechtigungen, bevor Sie die Überwachung aufheben können',
		notDeleted: 'Die folgenden Server wurden nicht überwacht, die Kanäle müssen jedoch manuell entfernt werden'
	},
	'es-ES': {
		default: '¡Se produjo un error al eliminar el servidor!',
		notUnmonitored: 'Los siguientes servidores requieren los permisos de categoría y/o canal necesarios antes de poder dejar de supervisar',
		notDeleted: 'Los siguientes servidores no fueron monitoreados, pero los canales deben eliminarse manualmente'
	}
};

export const unmonitoringErrorLocalizations = {
	da: 'Der opstod en fejl under fjernelsen af serverovervågning. Prøv igen senere!',
	de: 'Beim Aufheben der Serverüberwachung ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal!',
	'es-ES': '¡Se produjo un error al dejar de supervisar el servidor! ¡Inténtalo de nuevo más tarde!'
};

export const deletionErrorLocalizations = {
	da: 'Der opstod en fejl under fjernelsen af kanalerne. Fjern dem manuelt!',
	de: 'Beim Löschen der Kanäle ist ein Fehler aufgetreten. Bitte löschen Sie sie manuell!',
	'es-ES': '¡Se produjo un error al eliminar los canales! ¡Elimínalos manualmente!'
};

export const noChannelSpecifiedErrorLocalizations = {
	da: 'Der blev ikke angivet en kanal!',
	de: 'Es wurde kein Kanal angegeben!',
	'es-ES': '¡No se especificó ningún canal!'
};

export const successMessageLocalizations = {
	da: 'Serveren blev fjernet med succes!',
	de: 'Der Server wurde erfolgreich entfernt!',
	'es-ES': '¡El servidor se eliminó correctamente!'
};
