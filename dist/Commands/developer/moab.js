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
const snipeManager_1 = require("../../Util/managers/littleManagers/snipeManager");
class NameCommand extends BaseCommand_1.BaseCommand {
    constructor(client) {
        super(client, {
            name: "moab",
            dev: true,
        });
    }
    run(base) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, snipeManager_1.moab)(base.args[0] || base.message.channel.id);
            const channel = base.client.channels.cache.get(base.args[0] || base.message.channel.id).name;
            return base.message.reply(` Borrados todos los snipes en el canal ${channel}`);
        });
    }
}
exports.default = NameCommand;
