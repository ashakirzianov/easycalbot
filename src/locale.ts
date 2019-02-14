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
};

export const locales: Locale[] = [
    en,
];

export type LocaleKey = keyof Locale;
export type LocaleSelector = (l: Locale) => Locale[keyof Locale];
export function localeSelector(key: keyof Locale) {
    return (l: Locale) => l[key];
}
