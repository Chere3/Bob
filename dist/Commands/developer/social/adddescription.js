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
const BaseCommand_1 = require("../../../Util/Classes/BaseCommand");
const socialCommandsManager_1 = require("../../../Util/managers/littleManagers/socialCommandsManager");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "adddescription",
            dev: true,
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`> __**Debes de ingresar el valor al que le quieres agregar la descripción.**__`);
            if (!base.args[1])
                return base.message.reply(`> __**Debes de ingresar la descripción a agregar.**__`);
            try {
                yield (0, socialCommandsManager_1.addDescription)(base.args.slice(1).join(" "), base.args[0]);
                base.message.reply(`> __**Descripción agregada con éxito.**__\n\nEjemplos de visualización:\n\`\`\`${base.args.slice(1).join(" ").replace(`{author}`, `@${base.member.displayName}`).replace(`{user}`, `@${base.guild.me.displayName}`)}\`\`\``);
            }
            catch (e) {
                base.message.reply(`Ha ocurrido un error.\n\`\`\`${String(e).slice(6)}\`\`\``);
            }
        });
    }
}
exports.default = NameCommand;
