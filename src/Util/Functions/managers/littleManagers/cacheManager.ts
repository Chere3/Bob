import { db } from '../../../../index';
export function getTestMode() {
    return db.getData("/").test
}
