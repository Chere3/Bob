import { Client, MessageEmbed } from "discord.js";
import { botCommand, revisionManager } from "../../Managers/CommandsManager/NormalCommands/revisionManager";
import { run } from "../../Managers/CommandsManager/NormalCommands/runManager";
import util from "util"
import { messageCollect, messageCollector } from "../../Managers/MiniManagers/collectionManager";

export default class evalCommand extends revisionManager {
    constructor(client: Client) {
        super(client, new botCommand()
        .setName(`eval`)
        .setInfoOptions({description: `Calcula codigo con este comando.`, usage: "eval <codigo>", examples: ["eval console.log(`Hello world`)"]})
        .setCommandOptions({expectedArgs: 1, expectedArgsMin: 1})
        .setChannelAndGuildOptions({developer: true})
        )
    }

    async run(b: run) {
        const msgCollector = messageCollect
        const embed = new MessageEmbed().setColor(`PURPLE`)
        try {
        var evaled = eval(b.args.join(" "));
        if (evaled instanceof Promise && typeof evaled.then == "function" && typeof evaled.catch == "function") evaled = await evaled
        if (b.flags.includes(`silent`)) return;
        b.send({embeds: [embed.setDescription(`\`\`\`typescript\n${util.inspect(evaled, true, 0)}\`\`\``)]})
        } catch (e: any) {
            b.send({embeds: [embed.setDescription(`\`\`\`typescript\n${e}\`\`\``).setFields([{name: `Tipo de error:`, "value": `\`\`\`${e.name}\`\`\``, inline: true}, {name: `Tiempo de calculacion:`, value: `\`\`\`${Date.now() - b.message.createdTimestamp}ms\`\`\``, inline: true}])]})
        }
    }
}