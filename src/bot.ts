import { getOrCreateUser, updateUser } from './store';
import { parseAndExec } from './execute';
import moment = require('moment');

export function execute(message: string, id: number): string {
    const user = getOrCreateUser(id);
    const now = moment();
    const ctx = { user, now };
    const result = parseAndExec(message, ctx);
    updateUser(result.user);

    return result.reply;
}
