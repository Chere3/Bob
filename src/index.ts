import clientConstructor from "./Managers/ClientData/centralData";
// @ts-ignore
import Captain from "captainjs"

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

new clientConstructor(process).centralData();