import { cache } from "../../CacheManager/Cache"
// @ts-ignore
import file from "../../../../cache.json"
import { Client } from "discord.js"

type categoryOfAction = "botStatus"
export interface action {
    name: string,
    category: categoryOfAction
    description: string
}

/**
 * The constructor of action
 */

export class DashboardAction {
    name: string
    category: categoryOfAction
    description: string

    /**
     * @typedef {Object} action - The options of the action.
     * @property {string} name - The name of the action.
     * @property {string} category - The category of the action.
     * @property {string} description - The description of the action.
     */

    /**
     * @param {action} options - The options of the action.
     */

    constructor(options = {} as action) {
        this.setup(options)
    }

    /**
     * @method setup - The setup of the action.
     * @param {action} options - The options of the action.
     */

    setup(options) {
        const d = options as action;

        /**
         * The name of the action.
         * @type {string}
         */

        if (!d?.name && !d?.description) return;

        this.name = d.name ?? null;

        /**
         * The category of the action.
         * @type {string}
         */

        this.category = d.category ?? null;

        /**
         * The description of the action.
         * @type {string}
         */

        this.description = d.description ?? null;
    }

    /**
     * Set the name of the action.
     * @param {string} name - The name of the action.
     * @returns {this} - The action.
     */

    setName(name: string) {
        this.name = name
        return this
    }

    /**
     * Set the category of the action.
     * @param {string} category - The category of the action.
     * @returns {this} - The action.
     */

    setCategory(category: categoryOfAction) {
        this.category = category
        return this
    }

    /**
     * Set the description of the action.
     * @param {string} description - The description of the action.
     * @returns {this} - The action.
     */

    setDescription(description: string) {
        this.description = description
        return this
    }

    /**
     * Get the json data of the action.
     * @returns {action} - The json data of the action.
     */

    toJSON() {
        return {
            name: this.name,
            category: this.category,
            description: this.description
        }
    }
}

/**
 * The main class that controls the actions of the bot.
 */

export default class ActionsCentralManager extends DashboardAction {
    client: Client
    /**
     * Controls the actions of the bot.
     */
    constructor(client: Client) {
        super()
        this.client = client
    }

    /**
     * @method addAction - Add an action to the actions of the bot.
     */

    addAction() {
        if (!this.name || !this.category || !this.description) return;

        const action = this.toJSON()
        
        const a = file.dashboardActions
        a.unshift(action)
        
        new cache().set("dashboardActions", a)

        this.client.emit(`actionAdded`, action)

        return {
            success: true,
            message: "The action has been added.",
            action: action
        }
    }
}