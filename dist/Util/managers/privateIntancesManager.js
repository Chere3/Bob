"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateInstances = void 0;
const cacheManager_1 = require("./cacheManager");
const a = require("../../../cache.json");
class PrivateInstances extends cacheManager_1.CacheManager {
    constructor(client) {
        super(client);
        this.client = client;
    }
    getkey(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = yield new cacheManager_1.CacheManager(this.client).get();
            return cache.instances[type];
        });
    }
}
exports.PrivateInstances = PrivateInstances;
