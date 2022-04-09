import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import file from "../../cache.json"

/**
 * The main class of the cache.
 */

export class cache {
    constructor() {}

    /**
     * @method get - Get the cache of the given key.
     */

    get() {
        return new JsonDB(new Config("cache", true, true, "/")).getData("/") as typeof file
    }

    /**
     * @method set - Set the cache of the given key.
     */

    set(key: string, value: any) {
        new JsonDB(new Config("cache", true, true, "/")).push(`${key}`, value)
        return {
            success: true,
            objectSet: value,
            keySet: key,
            allCache: this.get(),
            message: "The cache has been setted."
        }
    }
}