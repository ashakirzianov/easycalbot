import { Success, Parser } from './parserCombinators';
import * as parsers from './parser';

function parseExpectSuccess<T>(parser: Parser<T>, input: string): Success<T> {
    const result = parser(input);
    if (!result.success) {
        throw new Error(`Couldn't parser: ${input} with ${parser.name}`);
    }

    return result;
}
it('Parse string record correctly', () => {
    const result = parseExpectSuccess(parsers.record, 'Dec 14, 2019 -- I\'m 30!').value;
    expect(result.date.year).toBe(2019);
    expect(result.date.month).toBe(11);
    expect(result.date.day).toBe(14);
    expect(result.reminder).toBe('I\'m 30!');
});
