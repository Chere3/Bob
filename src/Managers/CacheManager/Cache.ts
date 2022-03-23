import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

/**
 * The main class of the cache.
 */

export class cache {
    constructor() {}

    /**
     * @method get - Get the cache of the given key.
     */

    get(key?: string) {
        if (!key) return new JsonDB(new Config("cache", true, true, "/")).getData("/")
        return new JsonDB(new Config("cache", true, true, "/")).getData(`/${key}`)
    }
}