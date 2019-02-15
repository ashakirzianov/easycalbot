import { months, Locale } from './locale';
import { Month, BotCommand, Record, UserInfo, ExecuteResult, UserRecordId, UserRecord, CommandContext } from './model';
import { commandParser } from './parser';
import { parsedRecordToRecord } from './dateConvertion';

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
        id: user.id,
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

export function executeCommand(cmd: BotCommand, ctx: CommandContext): ExecuteResult {
    switch (cmd.command) {
        case 'create-record':
            const [newUser, record] = addRecord(ctx.user, parsedRecordToRecord(cmd.record, ctx.now));
            return {
                user: newUser,
                reply: userRecordToString(record),
            };
        case 'cant-parse':
        default:
            return {
                user: ctx.user,
                reply: "I didn't get it",
            };
    }
}

export function parseAndExec(input: string, ctx: CommandContext): ExecuteResult {
    const command = parseCommand(input);
    const result = executeCommand(command, ctx);

    return result;
}

function userRecordToString(record: UserRecord): string {
    return `#${record.id} ${record.record.date.format('ddd MMMM Do YYYY')}:\n${record.record.reminder}`;
}
