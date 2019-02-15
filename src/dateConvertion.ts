import {
    PartialDate, AbsoluteDate, Weekday, RelativeDate, ParsedRecord, Record,
} from './model';
import moment = require('moment');

function partialToAbsolute(partial: PartialDate, now: AbsoluteDate): AbsoluteDate {
    const y = partial.year || now.year();
    const m = partial.month || now.month();
    const d = partial.day || now.date();

    return moment([y, m, d]);
}

export function inNDays(n: number, now: AbsoluteDate): AbsoluteDate {
    return moment(now).add(n, 'd');
}

export function nextWeekday(w: Weekday, now: AbsoluteDate): AbsoluteDate {
    const currentWeekday = now.day();
    let days = w - currentWeekday;
    days = days <= 0 ? days + 7 : days;
    return inNDays(days, now);
}

function relativeToAbsolute(relative: RelativeDate, now: AbsoluteDate): AbsoluteDate {
    switch (relative.date) {
        case 'partial':
            return partialToAbsolute(relative, now);
        case 'today':
            return now;
        case 'tomorrow':
            return inNDays(1, now);
        case 'weekday':
            return nextWeekday(relative.day, now);
        default:
            throw new Error('Unsupported date');
    }
}

export function parsedRecordToRecord(parsed: ParsedRecord, now: AbsoluteDate): Record {
    const d = relativeToAbsolute(parsed.date, now);
    return {
        reminder: parsed.reminder,
        date: d,
        remindAt: d,
    };
}
