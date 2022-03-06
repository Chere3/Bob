import * as fs from "fs/promises"
import * as path from "path"
import { Client } from "discord.js";
import { catcher, sentry } from "../..";

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
                        client.commands.set(clase.name, clase);
                    } catch (e) {
                        console.error(e); 
                        sentry.captureException(e)
                    } finally {
                        catcher.finish()
                    }
                }
            }
        }
    })();

    (async function handleEvents(dir= "../../eventos") {
        catcher
        let archivos = await fs.readdir(path.join(__dirname, dir));
        for (let archivo of archivos) {
            let valor = await fs.lstat(path.join(__dirname, dir, archivo));
            if (valor.isDirectory()) {
                handleEvents(path.join(dir, archivo));
            } else {
                if (!archivo.endsWith(".ts")) return;
                let eventoNombre = archivo.substring(0, archivo.indexOf(".ts"));
                try {
                    let evento = await import(path.join(__dirname, dir, archivo));
                    client.on(eventoNombre, evento.run.bind(null, client)); 
                } catch (e) {
                    // @ts-ignore
                    global.consola.error(`| Ocurrió un error tratando de iniciar el evento: ${eventoNombre} |`)
                    console.log(e);
                    sentry.captureException(e)
                } finally {
                    catcher.finish()
                }
            }
        }
    })();
}