import { Client, MessageEmbed } from "discord.js";
import { botCommand, revisionManager } from "../../Managers/CommandsManager/NormalCommands/revisionManager";
import { run } from "../../Managers/CommandsManager/NormalCommands/runManager";
import util from "util"
import { messageCollect, messageCollector } from "../../Managers/MiniManagers/collectionManager";
import utilManager from "../../Managers/MiniManagers/utilManager";

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
        const utils = utilManager
        const embed = new MessageEmbed().setColor(`PURPLE`)
        try {
        var evaled = eval(b.args.join(" "));
        if (evaled instanceof Promise && typeof evaled.then == "function" && typeof evaled.catch == "function") evaled = await evaled

        if (b.flags.includes(`silent`)) return;
        if (b.flags.includes(`async`)) evaled = eval(`(await () => {${b.args.join(" ")}})()`)
        
        b.send({embeds: [embed.setDescription(`\`\`\`typescript\n${util.inspect(evaled, true, 0)}\`\`\``)]}).catch(async () => {
            const arrays = new utilManager().divideTextIntoArrays(util.inspect(evaled, true, 0), 4000);
            const embeds = [] as MessageEmbed[]

            const m1 = await b.send({embeds: [embed.setDescription(`\`\`\`typescript\n${arrays[0]}\`\`\``)], components: [b.defaultPaginator]});

            for (let i = 0; i < arrays.length; i++) {
                embeds.push(new MessageEmbed().setColor(`PURPLE`).setDescription(`\`\`\`typescript\n${arrays[i]}\`\`\``))
            }

            await new messageCollect().setAuthor(b.author).setMessage(m1).setEmbeds(embeds).start()
        })

        } catch (e: any) {
            b.send({embeds: [embed.setDescription(`\`\`\`typescript\n${e}\`\`\``).setFields([{name: `Tipo de error:`, "value": `\`\`\`${e.name}\`\`\``, inline: true}, {name: `Tiempo de calculacion:`, value: `\`\`\`${Date.now() - b.message.createdTimestamp}ms\`\`\``, inline: true}])]})
        }
    }
}