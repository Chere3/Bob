import { Client } from "discord.js";
import { sentry, transaction } from "../../..";
import { BaseCommand } from "../../../Util/Classes/BaseCommand";
import { TempContext } from "../../../Util/Classes/Context";


export default class removeImageCommand extends BaseCommand {
constructor(client: Client) {
super(client, {
name: "removeimage",
description: "Remueve una imagen de la base de datos.",
category: "developer",
aliases: ["rm", "imageremove"],
dev: true,
usage: (prefix: "prefix") => "removeimage <url>",
example: (prefix: "prefix") => "removeimage https://i.imgur.com/NQQQQQQ.png",
      })
  }


async run(base: TempContext) {
if (!base.args[0]) return base.message.reply(`> __**Debes de ingresar el URL de la imagen a eliminar.**__`);
transaction
try {
    await base.client.all.socialCommandsCore.deleteImage(base.args[0]);
    base.message.reply(`> __**Imagen eliminada con éxito.**__`);
} catch (e) {
    if (!String(e).startsWith("Error:")) {
        base.message.reply(`> __**${base._INTERNAL_E_TEXT}**__`);
        sentry.captureException(e)
        return transaction.finish();
    }

    base.message.reply(`> __**${String(e).slice(6)}**__`);
} finally {
    transaction.finish()
}
}}