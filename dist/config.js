"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.config = {
    auth: {
        token: process.env.TOKEN,
        sentry: process.env.SENTRY,
        mongoURI: process.env.MONGO_URI,
        auth_logs: process.env.AUTH_LOGS,
        auth_ratelimit_logs: process.env.AUTH_R_LOGS,
        auth_ratelimit2_logs: process.env.AUTH_RR_LOGS,
        auth_api_imgs: process.env.API_IMGS,
    },
    prefix: "!",
    serverInvite: "discord.gg/",
    owners: ["852588734104469535", `761293862882508800`],
};
