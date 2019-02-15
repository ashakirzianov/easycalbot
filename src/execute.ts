import { months, Locale } from './locale';
import { Month, BotCommand, Record, UserInfo, ExecuteResult, UserRecordId, UserRecord } from './model';
import { commandParser } from './parser';

export function nextId(user: UserInfo): UserRecordId {
    const maxId = user.records
        .reduce((max, rec) => max < rec.id ? rec.id : max, 0);
    return maxId + 1;
}

export function addRecord(user: UserInfo, record: Record): [UserInfo, UserRecord] {
    const userRecord = {
        id: nextId(user),
        record: record,
    };

    return [{
        records: user.records.concat(userRecord),
    },
        userRecord,
    ];
}

export function monthToLocale(l: Locale, m: Month): string {
    const ms = months(l);
    return 0 >= m && m < 12
        ? ms[m]
        : 'error'; // TODO: better error handling
}

export function parseCommand(text: string): BotCommand {
    const command = commandParser(text);

    return command.success
        ? command.value
        : {
            command: 'cant-parse' as 'cant-parse',
            text: text,
        };
}

export function executeCommand(cmd: BotCommand, user: UserInfo): ExecuteResult {
    switch (cmd.command) {
        case 'create-record':
            const [newUser, record] = addRecord(user, cmd.record);
            return {
                user: newUser,
                reply: `#${record.id}:\n${recordToString(record.record)}`,
            };
        case 'cant-parse':
        default:
            return {
                user: user,
                reply: "I didn't get it",
            };
    }
}

export function parseAndExec(input: string, user: UserInfo): ExecuteResult {
    const command = parseCommand(input);
    const result = executeCommand(command, user);

    return result;
}

export function recordToString(record: Record): string {
    return `${record.date.toDateString()} - ${record.reminder}`;
}
