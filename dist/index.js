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
exports.db = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const handlers_1 = require("./Util/Functions/handlers");
const captainjs_1 = __importDefault(require("captainjs"));
const login_1 = __importDefault(require("./Database/login"));
require("./Typings");
const superagent_1 = __importDefault(require("superagent"));
const node_json_db_1 = require("node-json-db");
const JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
global.prettyConsole = new captainjs_1.default.Console({
    use_colors: true,
    debug: false,
    format: "§8[§d%time%§8] [%prefix%§8] §7%message%",
    log_prefix: "§aLog",
    warn_prefix: "§eWarn",
    error_prefix: "§cError",
    info_prefix: "§bInfo",
    debug_prefix: "§bDebug",
});
const TempoClient = new discord_js_1.Client({
    intents: [
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
        "GUILDS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_INVITES",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "GUILD_PRESENCES",
        "GUILD_VOICE_STATES",
        "GUILD_WEBHOOKS",
    ],
    allowedMentions: { repliedUser: false, parse: ["users"] },
});
TempoClient.slashCommands = new discord_js_1.Collection();
TempoClient.commands = new discord_js_1.Collection();
TempoClient.invitations = new discord_js_1.Collection();
TempoClient.cooldoown = new discord_js_1.Collection();
(0, handlers_1.handlers)(TempoClient);
exports.db = new node_json_db_1.JsonDB(new JsonDBConfig_1.Config("cache", true, true, "/"));
TempoClient.login(config_1.config.auth.token).then((x) => {
    login_1.default.then(() => {
        global.prettyConsole.log(`La base de datos 1 esta lista.`);
    });
});
process.on("rejectionHandled", (a) => __awaiter(void 0, void 0, void 0, function* () {
    global.prettyConsole.error(a);
    const embed = new discord_js_1.MessageEmbed()
        .setAuthor(`Error.`)
        .setDescription(`\`\`\`fix\n ${a}\`\`\``)
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
}));
process.on("uncaughtException", (a) => __awaiter(void 0, void 0, void 0, function* () {
    global.prettyConsole.error(a.name);
    global.prettyConsole.error(a.message);
    console.log(a.stack);
    const embed = new discord_js_1.MessageEmbed()
        .setAuthor(`Error.`)
        .setDescription(`\`\`\`fix\n ${a.name}\`\`\``)
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
}));
process.on("unhandledRejection", (a) => __awaiter(void 0, void 0, void 0, function* () {
    global.prettyConsole.error(a);
    const embed = new discord_js_1.MessageEmbed()
        .setAuthor(`Error.`)
        .setDescription(`\`\`\`fix\n ${a}\`\`\``)
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
}));
