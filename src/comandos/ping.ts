import { Client } from "discord.js";
import { botCommand, revisionManager } from "../Managers/CommandsManager/NormalCommands/revisionManager";
import { run } from "../Managers/CommandsManager/NormalCommands/runManager";

export default class evalCommand extends revisionManager {
    constructor(client: Client) {
        super(client, new botCommand()
        .setName(`eval`)
        .setInfoOptions({usage: `eval <codigo>`, examples: [`eval client`], description: `Evalua codigo con este comando`})
        .setCommandOptions({expectedArgs: 1, expectedArgsMin: 1})
        .setChannelAndGuildOptions({developer: true})
        )
    }

    async run(b: run) {
        b.message.reply(`Ola`)
    }
}