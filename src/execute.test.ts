import { UserInfo } from './model';
import { parseAndExec } from './execute';
import moment = require('moment');

const user: UserInfo = {
    id: 0,
    records: [],
};

const ctx = {
    user: user,
    now: moment([2019, 4, 1]),
};

it('Parse and execute create record', () => {
    const message = 'May 1, 2019--   uprise!!!';
    const execResult = parseAndExec(message, ctx);

    expect(execResult.reply).toBe('#1 Wed May 1st 2019:\nuprise!!!');
});
