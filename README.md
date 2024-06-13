[![Invite to Server](https://img.shields.io/static/v1?label=&message=Invite%20to%20Server&color=forestgreen)](https://discord.com/api/oauth2/authorize?client_id=788083161296273517&permissions=269485072&scope=bot%20applications.commands)
![Discord Server Count](https://img.shields.io/endpoint?url=https%3A%2F%2Fmcstatusbot-delegate-production.up.railway.app%2Fcount%2FgetFormatted)
[![Make A Donation](https://img.shields.io/static/v1?label=&message=Donate&color=d9b811&logo=buymeacoffee&logoColor=white)](https://www.buymeacoffee.com/rahulrao)
[![Visit our website](https://img.shields.io/static/v1?label=&message=Website&color=purple)](https://mcstatusbot.com/)

# Minecraft Server Status - Discord Bot

A simple [Discord.js](https://www.npmjs.com/package/discord.js) bot that displays the status of [Minecraft](https://minecraft.gamepedia.com) servers using the
[mcstatus.io](https://mcstatus.io/) library.

**To use:** Simply [invite](https://discord.com/api/oauth2/authorize?client_id=788083161296273517&permissions=269485072&scope=bot%20applications.commands) the
bot to your server.

**Enjoying our bot?** Our bot is completely free to use, and will always remain so. A [donation](https://www.buymeacoffee.com/rahulrao) of any amount helps keep
our server running!

**Want to contribute a translation?** Read the [contributing guide](https://github.com/tedztar/mcstatusbot/blob/V0.2/CONTRIBUTING.md) here.

## May/June 2024 Update

-   Various bugfixes after bot migration to new cloud server
-   Package updates on bot
-   Multi-language support! (German for now but more languages to follow)
-   Added contribution guide for languages

## Features

-   Auto-updating voice channels to display the server's status and the number of players online
-   Support for both Java and Bedrock servers
-   Support for monitoring multiple Minecraft servers at once
-   Check the status of non-monitored servers
-   Slash command support with ephemeral responses to prevent channels from being cluttered with commands
-   Multiple languages: 🇬🇧 🇩🇪

<br>
<table style='border: none'>
<tr>
<td>
<img src="./assets/channels.png" height="200" />
</td>
<td>
<img src="./assets/status.png" height="200" />
</td>
</tr>
</table>

## Usage

`/status [server|ip] [type]` Displays the current status and active players for any server

`/monitor ip [nickname] [type]` Create 2 voice channels that display the status of a Minecraft server and optionally set a nickname

`/nickname nickname [server]` Change the nickname of a monitored Minecraft server

`/default server` Set a server to be the default for all commands

`/unmonitor [server|all]` Remove the voice channels for the specified server or all servers

`/bug` Send a bug report to the developers

`/help` List the other commands

### Usage notes:

**Bedrock servers:** to use the `/status` and `/monitor` commands, you must set the `type` option to "Bedrock" for the bot to function correctly.

**Aternos/other hosting users:** Underscores are not allowed in Domain names! Please change your server address to remove underscores.

## Roadmap

### Feature Updates

-   [ ] Rework status, nickname, and unmonitor commands to include dropdown menus
-   [ ] Rework monitor and nickname commands to include modal workflow
-   [ ] Add option to monitor server with message embed instead of voice channels
-   [ ] Link Discord usernames to Minecraft accounts for player list in status command (see [this](https://github.com/dommilosz/minecraft-auth) repository)
-   [ ] Add graph support (see [this](https://github.com/cappig/MC-status-bot) repository)
-   [x] Add localization support
