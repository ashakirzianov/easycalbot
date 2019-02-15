import { parseExpectSuccess } from './test-utils';
import { decimal } from './parserCombinators';

it('decimal', () => {
    const result = parseExpectSuccess(decimal, '42');
    expect(result.value).toBe(42);
});
