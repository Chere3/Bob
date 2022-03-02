import {config as envconfig} from "dotenv";

envconfig();

export const config = {
    authData: {
        discord: {
            token: process.env.TOKEN,
            webhooks: [{url: process.env.AUTH_LOGS}, {url: process.env.AUTH_R_LOGS}, {url: process.env.AUTH_RR_LOGS}]
        },
        DBS: {
            imagesDB: [{token: process.env.API_IMGS}, {token: process.env.API_IMGS2}, {token: process.env.API_IMGS3}, {token: process.env.API_IMGS4}],
            cache: process.env.REDIS,
            mongoDB: process.env.MONGO_URI
        }
    }
}