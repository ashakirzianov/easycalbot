import { getOrCreateUser, updateUser } from './store';
import { parseAndExec } from './execute';

export function execute(message: string, id: number): string {
    const user = getOrCreateUser(id);
    const result = parseAndExec(message, user);
    updateUser(result.user);

    return result.reply;
}
