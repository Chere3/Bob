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
            name: "addkissimages",
            description: "Adds images to the kiss command",
            dev: true,
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, socialCommandsManager_1.addImages)(base.args, "kiss");
                return base.message.reply(`Se han subido \`${base.args.length}\` imagenes a la base de datos del beso.`);
            }
            catch (e) {
                base.message.reply(`Ha ocurrido un error: \`${e}\``);
            }
        });
    }
}
exports.default = NameCommand;
