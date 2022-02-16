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
const util_1 = require("util");
const BaseCommand_1 = require("../../Util/Classes/BaseCommand");
const DBUtil_1 = require("../../Util/Functions/utils/DBUtil");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "userdb",
            description: "Descripcion",
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base.args[0])
                return base.message.reply(`El ID del usuario es obligatorio.`);
            const a = yield (0, DBUtil_1.getUserDB)(base.args[0]).catch((a) => {
                base.message.reply(a);
            });
            const b = (0, util_1.inspect)(a, { depth: Number(base.args[1] || 1) });
            base.message.reply(`\`\`\`json\n${b}\`\`\``);
        });
    }
}
exports.default = NameCommand;
