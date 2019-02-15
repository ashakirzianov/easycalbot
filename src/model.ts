export type Time = {
    hours: number,
    minutes: number,
};

export type Year = number;
export type Month = number;
export type Day = number;
export type Weekday = number;
export type PartialDate = {
    date: 'partial',
    year?: Year,
    month?: Month,
    day?: Day,
    time?: Time,
};
export type WeekDayDate = {
    date: 'weekday',
    day: Weekday,
};
export type TodayDate = { date: 'today' };
export type TomorrowDate = { date: 'tomorrow' };
export type InPartialDate = {
    date: 'in',
    in: PartialDate,
};
export type RelativeDate =
    | PartialDate | InPartialDate
    | WeekDayDate | TomorrowDate | TodayDate
    ;
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
    record: ParsedRecord,
};
export type CannotParseCommand = {
    command: 'cant-parse',
    text: string,
};
export type BotCommand = CreateRecordCommand | CannotParseCommand;

export type CommandContext = {
    user: UserInfo,
    now: Date,
};

export type ExecuteResult = {
    reply: string,
    user: UserInfo,
};

export type Store = {
    users: {
        [id in UserId]?: UserInfo;
    };
};
