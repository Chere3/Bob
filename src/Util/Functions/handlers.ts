import * as fs from "fs/promises";
import * as path from "path";
import { Client } from "discord.js";
import { sentry, transaction } from '../../index';

export function handlers(TempoClient: Client) {
  
  (async function handleCommands(dir = "../../Commands") {
    transaction
    let files = await fs.readdir(path.join(__dirname, dir));
    for (let file of files) {
      let stat = await fs.lstat(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        handleCommands(path.join(dir, file));
      } else {
        if (file.endsWith(".ts")) {
          let { default: Class } = await import(
            path.join(__dirname, dir, file)
          );
          try {
            let CommandClass = new Class(TempoClient);
            TempoClient.commands.set(CommandClass.name, CommandClass);
          } catch (err) {
            console.error(err);
            sentry.captureException(err)
          } finally{
            transaction.finish();
          }
        }
      }
    }
  })();

  (async function handleSlashCommands(dir = "../../slash-commands") {
    transaction
    let files = await fs.readdir(path.join(__dirname, dir));
    for (let file of files) {
      let stat = await fs.lstat(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        handleSlashCommands(path.join(dir, file));
      } else {
        if (file.endsWith(".ts")) {
          let { default: Class } = await import(
            path.join(__dirname, dir, file)
          );
          try {
            let slashCommandClass = new Class(TempoClient);
            TempoClient.slashCommands.set(
              slashCommandClass.name,
              slashCommandClass
            );
          } catch (err) {
            console.error(err);
            sentry.captureException(err)
          } finally {
            transaction.finish();
          }
        }
      }
    }
  })();

  (async function handleEvents(dir = "../../Events") {
    transaction
    let files = await fs.readdir(path.join(__dirname, dir));
    for (let file of files) {
      let stat = await fs.lstat(path.join(__dirname, dir, file));
      if (stat.isDirectory()) {
        handleEvents(path.join(dir, file));
      } else {
        if (!file.endsWith(".ts")) return;
        let eventName = file.substring(0, file.indexOf(".ts"));
        try {
          let event = await import(path.join(__dirname, dir, file));
          TempoClient.on(eventName, event.run.bind(null, TempoClient));
        } catch (err) {
          console.log(
            `Hey, ocurrio un error tranado de iniciar el evento: ${eventName}`
          );
          console.log(err);
          sentry.captureException(err)
        } finally {
          transaction.finish();
        }
      }
    }
  })();
}
