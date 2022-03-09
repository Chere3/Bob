import { Client, MessageEmbed } from "discord.js";
import { botCommand, revisionManager } from "../../Managers/CommandsManager/NormalCommands/revisionManager";
import { run } from "../../Managers/CommandsManager/NormalCommands/runManager";

export default class evalCommand extends revisionManager {
    constructor(client: Client) {
        super(client, new botCommand()
        .setName(`ping`)
        .setInfoOptions({usage: `ping`, examples: [`ping`], description: `Saca la latencia del bot con este código.`})
        .setCommandOptions({expectedArgs: 0, expectedArgsMin: 0})
        .setChannelAndGuildOptions({developer: true})
        )
    }

    async run(b: run) {
        const message = b.message;
        if (!message) {
            b.de(`Ha ocurrido un error tratando de ejecutar el comando. Este error ha sido reportado al equipo de desarrollo.`)
            return;
        } else {
            const diff = Date.now() - message.createdTimestamp;
            const embed = new MessageEmbed().setColor(`PURPLE`).setDescription(`> **__Cliente:__ ${b.client.ws.ping}ms**\n> **__Mensajes:__ ${diff}ms**`)
            b.message.reply({embeds: [embed]})
        }
    }
}