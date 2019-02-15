import {
    PartialDate, AbsoluteDate, Weekday, RelativeDate, ParsedRecord, Record,
} from './model';

function partialToAbsolute(partial: PartialDate, now: Date): AbsoluteDate {
    const y = partial.year || now.getFullYear();
    const m = partial.month || now.getMonth();
    const d = partial.day || now.getDate();

    return new Date(y, m, d);
}

function inNDays(n: number, now: Date): Date {
    return new Date(now.getDate() + n);
}

function nextWeekday(w: Weekday, now: Date): Date {
    const currentWeekday = now.getDay();
    let days = currentWeekday - w;
    days = days <= 0 ? days + 7 : days;
    return inNDays(days, now);
}

function relativeToAbsolute(relative: RelativeDate, now: Date): AbsoluteDate {
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

export function parsedRecordToRecord(parsed: ParsedRecord, now: Date): Record {
    const d = relativeToAbsolute(parsed.date, now);
    return {
        reminder: parsed.reminder,
        date: d,
        remindAt: d,
    };
}
