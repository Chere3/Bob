import { Collection } from "discord.js";

declare module "discord.js" {
    interface Client {
    }

    interface Channel {
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