"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseSlashCommand_1 = require("../Util/Classes/BaseSlashCommand");
class ping extends BaseSlashCommand_1.BaseSlashCommand {
    constructor(Client) {
        super(Client, {
            name: "ping",
            description: "Ping del bot",
            type: 1,
        });
    }
}
exports.default = ping;
