import { UserInfo } from './model';
import { parseAndExec } from './logic';

const user: UserInfo = {
    records: [],
};

it('Parse and execute create record', () => {
    const message = 'May 1, 2019--   uprise!!!';
    const execResult = parseAndExec(message, user);

    expect(execResult.reply).toBe('#1:\nWed May 01 2019 - uprise!!!');
});
