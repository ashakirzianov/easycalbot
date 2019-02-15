import { months, Locale } from './locale';
import { Month, BotCommand, Record } from './model';
import { commandParser } from './parser';

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

export function messageToReply(message: string): string {
    const command = parseCommand(message);

    switch (command.command) {
        case 'create-record':
            return recordToString(command.record);
        case 'cant-parse':
        default:
            return "I didn't get it";
    }
}

export function recordToString(record: Record): string {
    return `${record.date.toDateString()}\n${record.reminder}`;
}
