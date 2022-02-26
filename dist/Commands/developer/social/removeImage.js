"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../..");
const BaseCommand_1 = require("../../../Util/Classes/BaseCommand");
class removeImageCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "removeimage",
            description: "Remueve una imagen de la base de datos.",
            category: "developer",
            aliases: ["rm", "imageremove"],
            dev: true,
            usage: (prefix) => "removeimage <url>",
            example: (prefix) => "removeimage https://i.imgur.com/NQQQQQQ.png",
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> __**Debes de ingresar el URL de la imagen a eliminar.**__`);
            __1.transaction;
            try {
                yield base.client.all.socialCommandsCore.deleteImage(base.args[0]);
                base.message.reply(`> __**Imagen eliminada con éxito.**__`);
            }
            catch (e) {
                if (!String(e).startsWith("Error:")) {
                    base.message.reply(`> __**${base._INTERNAL_E_TEXT}**__`);
                    __1.sentry.captureException(e);
                    return __1.transaction.finish();
                }
                base.message.reply(`> __**${String(e).slice(6)}**__`);
            }
            finally {
                __1.transaction.finish();
            }
        });
    }
}
exports.default = removeImageCommand;
