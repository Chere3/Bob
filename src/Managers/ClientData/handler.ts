import * as fs from "fs/promises"
import * as path from "path"
import { Client } from "discord.js";
import { catcher, sentry } from "../..";
import { socialCommandsManager } from "../MiniManagers/socialCommandsManager";

export default function handlers(client: Client) {
    (async function handleCommands(dir= "../../comandos"){
        catcher
        let archivos = await fs.readdir(path.join(__dirname, dir));
        for (let archivo of archivos) {
            let valor = await fs.lstat(path.join(__dirname, dir, archivo));
            if (valor.isDirectory()) {
                handleCommands(path.join(dir, archivo));
            } else {
                if (archivo.endsWith(".ts")) {
                    let {default: Class} = await import(path.join(__dirname, dir, archivo));
                    try {
                        let clase = new Class(client);
                        // @ts-ignore
                        global.commands.set(clase.name, clase);
                    } catch (e) {
                        console.error(e); 
                        sentry.captureException(e)
                    } finally {
                        catcher.finish()
                    }
                }
            }
        }

        // @ts-ignore
        new socialCommandsManager("hug", null, null).injector(client);
    })();
}