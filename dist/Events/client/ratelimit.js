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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const discord_js_1 = require("discord.js");
const superagent_1 = __importDefault(require("superagent"));
const cacheManager_1 = require("../../Util/managers/littleManagers/cacheManager");
const run = (client, a) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, cacheManager_1.getTestMode)() == true)
        return;
    const embed = new discord_js_1.MessageEmbed()
        .setAuthor(`Error.`)
        .setDescription(`\`\`\`fix\n ${a.message}\`\`\``)
        .setTimestamp()
        .setColor("RED");
    yield superagent_1.default
        .post(process.env.AUTH_LOGS)
        .send({ embeds: [embed] })
        .catch(() => __awaiter(void 0, void 0, void 0, function* () {
        yield superagent_1.default
            .post(process.env.AUTH_R_LOGS)
            .send({ embeds: [embed] })
            .catch(() => __awaiter(void 0, void 0, void 0, function* () {
            yield superagent_1.default
                .post(process.env.AUTH_RR_LOGS)
                .send({ embeds: [embed] })
                .catch(() => {
                console.log(`No pude enviar el mensaje de la webhook debido a un error.`);
            });
        }));
    }));
});
exports.run = run;
