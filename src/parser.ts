import {
    prefixes, translate, Parser, choice, iff,
    decimal, seq, prefix, projectLast, maybe, trimS, ifDefined, trim, anything,
} from './parserCombinators';
import { mapAndConcat } from './utils';
import { locales, localeSelector, Locale } from './locale';
import {
    Month, Year, Day, RelativeDate, ParsedRecord,
    CreateRecordCommand, BotCommand, AbsoluteDate, Record, PartialDate,
} from './model';

// Year
const yearDec = translate(
    decimal,
    y => y < 100 ? y + 2000 : y,
);
const yearWithApostrophe = translate(
    seq(prefix('\''), decimal),
    ([_, y]) => 2000 + y,
);

const year: Parser<Year> = choice(yearDec, yearWithApostrophe);
const tyear = trimS(year);

// Month

function monthParser(m: Month, key: keyof Locale) {
    return translate(
        prefixes(...mapAndConcat(locales, localeSelector(key))),
        () => m,
    );
}

const january = monthParser(0, 'jan');
const february = monthParser(1, 'feb');
const march = monthParser(2, 'mar');
const april = monthParser(3, 'apr');
const may = monthParser(4, 'may');
const june = monthParser(5, 'jun');
const july = monthParser(6, 'jul');
const august = monthParser(7, 'aug');
const september = monthParser(8, 'sep');
const october = monthParser(9, 'oct');
const november = monthParser(10, 'nov');
const december = monthParser(11, 'dec');

const month: Parser<Month> = choice(
    january, february, march, april, may, june,
    july, august, september, october, november, december,
);
const tmonth = trimS(month);

// Day

const dayDec = iff(decimal, d => d > 0 && d <= 31);
export const day: Parser<Day> = dayDec;
const tday = trimS(day);

// Date formats

const tcomma = trimS(prefix(','));
const tslash = trimS(prefix('/'));
const tdot = trimS(prefix('.'));

type DateParser = Parser<PartialDate>;

export const stringDate: DateParser = translate(
    seq(tmonth, maybe(tday), maybe(tcomma), maybe(tyear)),
    ([m, d, c, y]) => ({
        date: 'partial' as 'partial',
        month: m,
        day: d,
        year: y,
    }),
);

const numMonth = translate(
    iff(decimal, d => d > 0 && d <= 12),
    m => m - 1,
);

const americanDate: DateParser = translate(
    seq(trimS(numMonth), tslash, tday, tslash, tyear),
    ([m, s1, d, s2, y]) => ({
        date: 'partial' as 'partial',
        month: m,
        day: d,
        year: y,
    }),
);

const euroDate: DateParser = translate(
    seq(tday, tdot, trimS(numMonth), tdot, tyear),
    ([d, d1, m, d2, y]) => ({
        date: 'partial' as 'partial',
        day: d,
        month: m,
        year: y,
    }),
);

const date: DateParser = choice(euroDate, americanDate, stringDate);

// Record

const separator = trim(prefixes('--', '—', '-', ':'));
const message = anything;

export const record: Parser<ParsedRecord> = translate(
    seq(date, maybe(separator), message),
    ([d, s, m]) => ({
        date: d,
        reminder: m,
    }),
);

// Command

export const createRecord: Parser<CreateRecordCommand> = translate(
    record,
    r => ({
        command: 'create-record' as 'create-record',
        record: parsedRecordToRecord(r),
    }),
);

export const commandParser: Parser<BotCommand> = createRecord;

function partialToAbsolute(partial: PartialDate): AbsoluteDate {
    const now = new Date(Date.now());
    const y = partial.year || now.getFullYear();
    const m = partial.month || now.getMonth();
    const d = partial.day || now.getDay();

    return new Date(y, m, d);
}

function relativeToAbsolute(relative: RelativeDate): AbsoluteDate {
    switch (relative.date) {
        case 'partial':
            return partialToAbsolute(relative);
        default:
            throw new Error('Unsupported date');
    }
}

function parsedRecordToRecord(parsed: ParsedRecord): Record {
    const d = relativeToAbsolute(parsed.date);
    return {
        reminder: parsed.reminder,
        date: d,
        remindAt: d,
    };
}
