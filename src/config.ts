import { config as envconfig } from "dotenv";

envconfig();

export const config = {
  auth: {
    token: process.env.TOKEN,
    mongoURI: process.env.MONGO_URI,
    auth_logs: process.env.AUTH_LOGS,
    auth_ratelimit_logs: process.env.AUTH_R_LOGS,
    auth_ratelimit2_logs: process.env.AUTH_RR_LOGS,
  },
  prefix: "!",
  serverInvite: "discord.gg/",
  owners: ["642159495660830740", "852588734104469535"],
};
