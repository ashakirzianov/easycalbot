export type Time = {
    hours: number,
    minutes: number,
};

export type Year = number;
export type Month = number;
export type Day = number;
export type PartialDate = {
    year?: Year,
    month?: Month,
    day?: Day,
    time?: Time,
};
export type RelativeDate = PartialDate;
export type AbsoluteDate = Date;

export type ParsedRecord = {
    date: RelativeDate,
    text: string,
    before?: Time,
};

export type Record = {
    id: number,
    date: AbsoluteDate,
    remindAt: AbsoluteDate,
};

export type StringMonth =
    |'January' | 'February' | 'March' | 'April'
    | 'May' | 'June' | 'July' | 'August'
    | 'September' | 'October' | 'November' | 'December'
    ;
export const months: StringMonth[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
export function numToMonth(n: number): StringMonth | undefined {
    return n > 0 && n <= months.length
        ? months[n-1]
        : undefined;
}

export function monthToNum(month: StringMonth): number | undefined {
    const idx = months.findIndex(m => m === month);
    return idx >= 0 ? idx + 1 : undefined;
}

export function relativeToAbsolute(relative: RelativeDate): AbsoluteDate {
    const now = new Date(Date.now());
    const year = relative.year || now.getFullYear();
    const month = relative.month || now.getMonth();
    const day = relative.day || now.getDay();

    const date = new Date(year, month, day);

    return date;
}
