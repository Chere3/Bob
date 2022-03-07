import { Client } from "discord.js";
import { catcher, sentry } from "../..";
import { config } from "../../config";
import {run} from "../CommandsManager/NormalCommands/runManager"

export default function eventsCore(client: Client) {
    client.on(`messageCreate`, (a) => {
        if (a.author.bot) return;
        config.bot.prefixes.map(async x => {
            if (!a.content.startsWith(x)) return;
            const runManager = new run(a);
            var agrs = a.content.slice(x.length).trim().split(/ +/g); var args = []; var flags = [];
            for (const arg of agrs) {
                if (arg.startsWith("#")) {
                    flags.push(arg.slice(1))
                } else {
                    args.push(arg)
                }
            }

            runManager.args = args;
            runManager.flags = flags

            // @ts-ignore
            const command = args.shift().toLowerCase();

            // @ts-ignore
            let cmd = global.commands.get(command) || global.commands.find(x => x.commandOptions.aliases && x.commandOptions.aliases.includes(command));
            if (!cmd) return;
            if (await cmd.revision(a) !== false) return;
            try {
                cmd.run(runManager);
            } catch (e) {
                sentry.captureException(e)
                a.reply(`__**Este comando ha tenido un error que no se esperaba... Por lo cuál se ha cancelado su ejecución.**__`)
            } finally {
                catcher.finish();
            }
        })
    })

    client.on("ready", (a) => {
        // @ts-ignore
        global.consola.log(`| Client Ready |`)
    })
}