import { Success, Parser } from './parserCombinators';
import * as parsers from './parser';
import { parseExpectSuccess } from './test-utils';

it('Parse day correctly', () => {
    const result = parseExpectSuccess(parsers.day, '14');
    expect(result.value).toBe(14);
});

it('Parse string date correctly', () => {
    const result = parseExpectSuccess(parsers.stringDate, 'Dec 14, 1989');
    expect(result.next).toBe('');
    const value = result.value;
    expect(value.day).toBe(14);
    expect(value.month).toBe(11);
    expect(value.year).toBe(1989);
});

it('Parse string record correctly', () => {
    const result = parseExpectSuccess(parsers.record, 'Dec 14, 2019 -- I\'m 30!').value;
    expect(result.date.year).toBe(2019);
    expect(result.date.month).toBe(11);
    expect(result.date.day).toBe(14);
    expect(result.reminder).toBe('I\'m 30!');
});

it('Parse euro date record correctly', () => {
    const result = parseExpectSuccess(parsers.record, '14.12.2019- I\'m 30!').value;
    expect(result.date.year).toBe(2019);
    expect(result.date.month).toBe(11);
    expect(result.date.day).toBe(14);
    expect(result.reminder).toBe('I\'m 30!');
});

it('Parse american date record correctly', () => {
    const result = parseExpectSuccess(parsers.record, '12/14/2019- I\'m 30!').value;
    expect(result.date.year).toBe(2019);
    expect(result.date.month).toBe(11);
    expect(result.date.day).toBe(14);
    expect(result.reminder).toBe('I\'m 30!');
});

it('Parse 2-digits year record correctly', () => {
    const result = parseExpectSuccess(parsers.record, '12/14/19 - I\'m 30!').value;
    expect(result.date.year).toBe(2019);
    expect(result.date.month).toBe(11);
    expect(result.date.day).toBe(14);
    expect(result.reminder).toBe('I\'m 30!');
});
