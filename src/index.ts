import { Collection, Client, MessageEmbed } from "discord.js";
import { config } from "./config";
import { handlers } from "./Util/Functions/handlers";
import Captain from "captainjs";
import login from "./Database/login";
import "./Typings";
import superagent from "superagent";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { cache } from './Util/constants/cache';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
const {version} = require('../package.json');

export const sentry = Sentry; 

global.prettyConsole = new Captain.Console({
  use_colors: true,
  debug: false,
  format: "§8[§d%time%§8] [%prefix%§8] §7%message%",
  log_prefix: "§aLog",
  warn_prefix: "§eWarn",
  error_prefix: "§cError",
  info_prefix: "§bInfo",
  debug_prefix: "§bDebug",
});

const TempoClient = new Client({
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
});

TempoClient.slashCommands = new Collection();
TempoClient.commands = new Collection();
TempoClient.invitations = new Collection();
TempoClient.cooldoown = new Collection();



////////// SENTRY /////////////

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

export const transaction = Sentry.startTransaction({
  op: "commandError",
  name: "commandError",
});

export const managerError = Sentry.startTransaction({
  op: "managerError",
  name: "managerError",
});
///////////////////////////////////////////////////


handlers(TempoClient);
export var db = new JsonDB(new Config("cache", true, false, "/"));

TempoClient.login(config.auth.token).then((x) => {
  login.then(() => {
    global.prettyConsole.log(`La base de datos 1 esta lista.`);
  });
});
TempoClient.cache = db.getData("/") as cache;


process.on("rejectionHandled", async (a) => {
  const aa = await a;
  await sentry.captureException(aa);
});

process.on("uncaughtException", async (a) => {
  transaction;
  global.prettyConsole.error(a.name);
  global.prettyConsole.error(a.message);
  sentry.captureException(a);
  transaction.finish();
});

process.on("unhandledRejection", async (a) => {
  global.prettyConsole.error(a);
});

