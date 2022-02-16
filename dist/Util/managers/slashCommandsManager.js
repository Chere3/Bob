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
exports.constructSlashCommand = exports.uploadSlashCommands = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
function uploadSlashCommands(slashCommands) {
    return __awaiter(this, void 0, void 0, function* () {
        const clientId = "864917800010514432";
        const guildId = "912858763126538281";
        const rest = new rest_1.REST({ version: "9" }).setToken(process.env.TOKEN);
        try {
            console.log(`Estoy subiendo los (/) commands al servidor espera.`);
            yield rest.put(v9_1.Routes.applicationGuildCommands(clientId, guildId), {
                body: slashCommands,
            });
            return `Los (/) commands se subieron correctamente.`;
        }
        catch (e) {
            return `Error al subir los (/) commands: ${e}`;
        }
    });
}
exports.uploadSlashCommands = uploadSlashCommands;
function constructSlashCommand() {
    return __awaiter(this, void 0, void 0, function* () {
        const commands = [];
        const files = require("fs")
            .readdir(`../../../slash-commands`)
            .filter((file) => file.endsWith(".ts"));
        for (const file of files) {
            const command = require(`../../../slash-commands/${file}`);
            commands.push(command.data.ToJSON());
        }
        yield uploadSlashCommands(commands);
    });
}
exports.constructSlashCommand = constructSlashCommand;
