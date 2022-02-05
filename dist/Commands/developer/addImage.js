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
const BaseCommand_1 = require("../../Util/Classes/BaseCommand");
const socialCommandsManager_1 = require("../../Util/managers/littleManagers/socialCommandsManager");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "addimage",
            description: "Agrega una imagen a la base de datos",
            dev: true,
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0] || !base.args[1])
                return base.message.reply(`Faltan argumentos para este comando.`);
            try {
                const link = base.args[1];
                const type = base.args[0];
                yield (0, socialCommandsManager_1.addImage)(link, type);
                base.message.reply(`La imagen ${link} ha sido agregada con exito a la base de datos.`);
            }
            catch (error) {
                base.message.reply(`\`\`\`${error}\`\`\``);
            }
        });
    }
}
exports.default = NameCommand;
