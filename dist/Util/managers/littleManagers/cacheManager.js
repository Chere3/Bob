"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestMode = void 0;
const index_1 = require("../../../index");
function getTestMode() {
    return index_1.db.getData("/").test;
}
exports.getTestMode = getTestMode;
