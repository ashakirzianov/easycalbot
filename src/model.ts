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
    reminder: string,
    before?: Time,
};

export type Record = {
    reminder: string,
    date: AbsoluteDate,
    remindAt: AbsoluteDate,
};

export type UserRecordId = number;
export type UserRecord = {
    id: UserRecordId,
    record: Record,
};

export type UserId = number;
export type UserInfo = {
    id: UserId,
    records: UserRecord[],
};

export type CreateRecordCommand = {
    command: 'create-record',
    record: Record,
};
export type CannotParseCommand = {
    command: 'cant-parse',
    text: string,
};
export type BotCommand = CreateRecordCommand | CannotParseCommand;

export type ExecuteResult = {
    reply: string,
    user: UserInfo,
};

export type Store = {
    users: {
        [id in UserId]?: UserInfo;
    };
};
