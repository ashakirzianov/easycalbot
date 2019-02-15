export type Locale = {
    jan: string[],
    feb: string[],
    mar: string[],
    apr: string[],
    may: string[],
    jun: string[],
    jul: string[],
    aug: string[],
    sep: string[],
    oct: string[],
    nov: string[],
    dec: string[],
    today: string[],
    tomorrow: string[],
    monday: string[],
    tuesday: string[],
    wednesday: string[],
    thursday: string[],
    friday: string[],
    saturday: string[],
    sunday: string[],
    in: string[],
    minute: string[],
    hour: string[],
    day: string[],
};

const en: Locale = {
    jan: ['january', 'jan'],
    feb: ['february', 'feb'],
    mar: ['march', 'mar'],
    apr: ['april', 'apr'],
    may: ['may'],
    jun: ['june', 'jun'],
    jul: ['july', 'jul'],
    aug: ['august', 'aug'],
    sep: ['september', 'sep'],
    oct: ['october', 'oct'],
    nov: ['november', 'nov'],
    dec: ['december', 'dec'],
    today: ['today'],
    tomorrow: ['tomorrow'],
    monday: ['monday'],
    tuesday: ['tuesday'],
    wednesday: ['wednesday'],
    thursday: ['thursday'],
    friday: ['friday'],
    saturday: ['saturday'],
    sunday: ['sunday'],
    in: ['in an', 'in a', 'in'],
    minute: ['minutes', 'minute'],
    hour: ['hours', 'hour'],
    day: ['day', 'days'],
};

export const locales: Locale[] = [
    en,
];

export type LocaleKey = keyof Locale;
export type LocaleSelector = (l: Locale) => Locale[keyof Locale];
export function localeSelector(key: keyof Locale) {
    return (l: Locale) => l[key];
}

export function months(l: Locale): string[] {
    return [
        l.jan[0], l.feb[0], l.mar[0], l.apr[0], l.may[0], l.jun[0],
        l.jul[0], l.aug[0], l.sep[0], l.oct[0], l.nov[0], l.dec[0],
    ];
}
