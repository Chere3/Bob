import { Collection } from "discord.js";
import { kargs } from "../Managers/CommandsManager/NormalCommands/revisionManager";
import { cooldownCommand } from "./DiscordExtends";

declare module "discord.js" {
    interface Client {
        cooldowns: Collection<string, cooldownCommand>
        commands: Collection<string, kargs>
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
    }
}