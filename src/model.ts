export type Time = {
    hours: number,
    minutes: number,
};

export type Year = number;
export type Month =
    |'January' | 'February' | 'March' | 'April'
    | 'May' | 'June' | 'July' | 'August'
    | 'September' | 'October' | 'November' | 'December'
    ;
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

export const months: Month[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
