import clientConstructor from "./Managers/ClientData/centralData";
// @ts-ignore
import Captain from "captainjs"
import * as Sentry from "@sentry/node"
import { Transaction } from "@sentry/tracing";
import { FYPBot } from "./Typings/DiscordExtends";
import { Collection } from "discord.js";
import eventsCore from "./Managers/MiniManagers/eventsManager";
// @ts-ignore
global.consola = new Captain.Console({
    use_colors: true,
    debug: false,
    format: "§8[§d%time%§8] [%prefix%§8] §7%message%",
    log_prefix: "§aLog",
    warn_prefix: "§eWarn",
    error_prefix: "§cError",
    info_prefix: "§bInfo",
    debug_prefix: "§bDebug",
}) as any

// @ts-ignore
global.cooldowns = new Collection()
// @ts-ignore
global.commands = new Collection()

export var shortClient: FYPBot; export var catcher: Transaction; export var sentry: typeof Sentry
new clientConstructor(process).centralData().then(async x => {
    shortClient = await x
    catcher = await x.catcher
    sentry = await x.sentry
    await eventsCore(x.completeClient)
})