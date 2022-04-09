import { Collection } from "discord.js";
import { kargs, revisionManager } from "./src/Managers/CommandsManager/NormalCommands/revisionManager";
import { cooldownCommand } from "./src/Typings/DiscordExtends";

declare module "discord.js" {
    interface Client {
        cooldowns: Collection<string, cooldownCommand>
        commands: Collection<string, revisionManager>
    }

    interface channel {
        nsfw?: boolean
        name: string | null
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string,
            SENTRY: string,
            MONGO_URI: string,
            REDIS: string,
            API_IMGS: string,
            API_IMGS2: string,
            API_IMGS3: string,
            API_IMGS4: string,
            AUTH_LOGS: string,
            AUTH_R_LOGS: string,
            AUTH_RR_LOGS: string
        }

        interface Global {
            commands: Collection<string, revisionManager>
            Cooldowns: Collection<string, cooldownCommand>
        }
    }
}