"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.db = exports.dbb = exports.test = exports.managerError = exports.transaction = exports.sentry = void 0;
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const handlers_1 = require("./Util/Functions/handlers");
const captainjs_1 = __importDefault(require("captainjs"));
const login_1 = __importDefault(require("./Database/login"));
require("./Typings");
const node_json_db_1 = require("node-json-db");
const JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
const Sentry = __importStar(require("@sentry/node"));
const Tracing = __importStar(require("@sentry/tracing"));
const evalUtil_1 = require("./Util/constants/evalUtil");
const redis = __importStar(require("redis"));
const { version } = require('../package.json');
exports.sentry = Sentry;
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
    allowedMentions: { repliedUser: false, parse: ["users", "roles"] },
    partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"]
});
TempoClient.slashCommands = new discord_js_1.Collection();
TempoClient.commands = new discord_js_1.Collection();
TempoClient.invitations = new discord_js_1.Collection();
TempoClient.cooldoown = new discord_js_1.Collection();
TempoClient.all = evalUtil_1.allUtil;
Sentry.init({
    dsn: process.env.SENTRY,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Mongo({
            useMongoose: true
        })
    ],
    tracesSampleRate: 1.0,
    debug: true,
    release: version,
});
exports.transaction = Sentry.startTransaction({
    op: "commandError",
    name: "commandError",
});
exports.managerError = Sentry.startTransaction({
    op: "managerError",
    name: "managerError",
});
exports.test = "test";
exports.dbb = redis.createClient({
    url: "redis://redis-10073.c14.us-east-1-2.ec2.cloud.redislabs.com"
});
exports.dbb.on("connect", (a) => {
    global.prettyConsole.log(`Se ha conectado a la caché satifasctoriamente.`);
});
(0, handlers_1.handlers)(TempoClient);
exports.db = new node_json_db_1.JsonDB(new JsonDBConfig_1.Config("cache", true, false, "/"));
global.client = TempoClient;
exports.db;
TempoClient.login(config_1.config.auth.token).then((x) => {
    login_1.default.then(() => {
        global.prettyConsole.log(`La base de datos 1 esta lista.`);
    });
});
TempoClient.cache = exports.db.getData("/");
process.on("rejectionHandled", (a) => __awaiter(void 0, void 0, void 0, function* () {
    const aa = yield a;
    yield exports.sentry.captureException(aa);
}));
process.on("uncaughtException", (a) => __awaiter(void 0, void 0, void 0, function* () {
    exports.transaction;
    global.prettyConsole.error(a.name);
    global.prettyConsole.error(a.message);
    exports.sentry.captureException(a);
    exports.transaction.finish();
}));
process.on("unhandledRejection", (a) => __awaiter(void 0, void 0, void 0, function* () {
    global.prettyConsole.error(a);
}));
