import { CachedManager, Client } from "discord.js";
import { cacheStructure } from "../constants/cache";
import { instancesType } from "../constants/instances";
import { CacheManager } from "./cacheManager";
const a = require("../../../cache.json") as cacheStructure;
export class PrivateInstances extends CacheManager {
    client: Client;
    constructor(client: Client) {
        super(client);
        this.client = client;
    }

    async getkey(type: instancesType) {
        const cache = await new CacheManager(this.client).get();
        return cache.instances[type];
    }
}