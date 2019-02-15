import { getOrCreateUser, updateUser } from './store';
import { parseAndExec } from './execute';

export function execute(message: string, id: number): string {
    const user = getOrCreateUser(id);
    const now = new Date(Date.now());
    const ctx = { user, now };
    const result = parseAndExec(message, ctx);
    updateUser(result.user);

    return result.reply;
}
