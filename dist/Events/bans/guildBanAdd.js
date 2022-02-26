"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const cacheManager_1 = require("../../Util/managers/littleManagers/cacheManager");
const listBanManager_1 = require("../../Util/managers/littleManagers/listBanManager");
const run = (client, ban) => {
    if ((0, cacheManager_1.getTestMode)() == true)
        return;
    (0, listBanManager_1.updateListWithNewBan)(ban);
};
exports.run = run;
