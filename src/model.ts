export type Time = {
    hours: number,
    minutes: number,
};

export type PartialDate = {
    year?: number,
    month?: number,
    day?: number,
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
