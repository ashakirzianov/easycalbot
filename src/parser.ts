import {
    prefixes, translate, Parser, choice, iff,
    decimal, seq, prefix, projectLast, maybe, trimS, ifDefined, trim, anything,
} from "./parserCombinators";
import { mapAndConcat } from "./utils";
import { locales, localeSelector, Locale } from "./locale";
import { Month, Year, Day, months, RelativeDate, ParsedRecord } from "./model";

// Year
const yearDec = decimal;
const yearWithApostrophe = projectLast(seq(prefix("'"), decimal));

const year: Parser<Year> = choice(yearDec, yearWithApostrophe);
const tyear = trimS(year);

// Month

function monthParser(month: Month, key: keyof Locale) {
    return translate(
        prefixes(...mapAndConcat(locales, localeSelector(key))),
        () => month,
    );
}


const january = monthParser('January', 'jan');
const february = monthParser('February', 'feb');
const march = monthParser('March', 'mar');
const april = monthParser('April', 'apr');
const may = monthParser('May', 'may');
const june = monthParser('June', 'jun');
const july = monthParser('July', 'jul');
const august = monthParser('August', 'aug');
const september = monthParser('September', 'sep');
const october = monthParser('October', 'oct');
const november = monthParser('November', 'nov');
const december = monthParser('December', 'dec');

const month: Parser<Month> = choice(
    january, february, march, april, may, june,
    july, august, september, october, november, december,
);
const tmonth = trimS(month);

// Day

const dayDec = iff(decimal, d => d > 0 && d <= 31);
const day: Parser<Day> = dayDec;
const tday = trimS(day);

// Date formats

const tcomma = trimS(prefix(','));
const tslash = trimS(prefix('/'));
const tdot = trimS(prefix('.'));

type DateParser = Parser<RelativeDate>;

const stringDate: DateParser = translate(
    seq(tmonth, maybe(tday), maybe(tcomma), maybe(tyear)),
    ([m, d, c, y]) => ({
        month: m,
        day: d,
        year: y,
    }),
);

const numMonth = ifDefined(translate(decimal, numToMonth));
function numToMonth(n: number): Month | undefined {
    return n > 0 && n <= months.length
        ? months[n-1]
        : undefined;
}

const americanDate: DateParser = translate(
    seq(trimS(numMonth), tslash, tday, tslash, tyear),
    ([m, s1, d, s2, y]) => ({
        month: m,
        day: d,
        year: y,
    }),
);

const euroDate: DateParser = translate(
    seq(tday, tdot, trimS(numMonth), tdot, tyear),
    ([d, d1, m, d2, y]) => ({
        day: d,
        month: m,
        year: y,
    }),
);

const date: DateParser = choice(euroDate, americanDate, stringDate);

// Full

const separator = trim(prefixes('-', '--', '—', ':'));
const message = anything;

const recordParser: Parser<ParsedRecord> = translate(
    seq(date, maybe(separator), message),
    ([d, s, m]) => ({
        date: d,
        text: m,
    }),
);
