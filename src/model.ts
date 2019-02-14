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
    date: AbsoluteDate,
    remindAt: AbsoluteDate,
};

export type UserRecordId = number;
export type UserRecord = {
    id: UserRecordId,
    record: Record,
};

export type UserInfo = {
    records: UserRecord[],
};

export function nextId(user: UserInfo): UserRecordId {
    const maxId = user.records
        .reduce((max, rec) => max < rec.id ? rec.id : max, 0);
    return maxId + 1;
}

export function addRecord(user: UserInfo, record: Record): UserInfo {
    const userRecord = {
        id: nextId(user),
        record: record,
    };

    return {
        records: user.records.concat(userRecord),
    };
}

export function relativeToAbsolute(relative: RelativeDate): AbsoluteDate {
    const now = new Date(Date.now());
    const year = relative.year || now.getFullYear();
    const month = relative.month || now.getMonth();
    const day = relative.day || now.getDay();

    const date = new Date(year, month, day);

    return date;
}

export function parsedRecordToRecord(parsed: ParsedRecord): Record {
    const date = relativeToAbsolute(parsed.date);
    return {
        date: date,
        remindAt: date,
    };
}

export type CreateRecordCommand = {
    command: 'create-record',
    record: Record,
};
export type CannotParseCommand = {
    command: 'cant-parse',
    text: string,
};
export type BotCommand = CreateRecordCommand | CannotParseCommand;
