import { UserInfo } from './model';
import { parseAndExec } from './execute';

const user: UserInfo = {
    id: 0,
    records: [],
};

it('Parse and execute create record', () => {
    const message = 'May 1, 2019--   uprise!!!';
    const execResult = parseAndExec(message, user);

    expect(execResult.reply).toBe('#1:\nWed May 01 2019 - uprise!!!');
});
