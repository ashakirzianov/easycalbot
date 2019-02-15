import { Parser, Success } from './parserCombinators';

export function parseExpectSuccess<T>(parser: Parser<T>, input: string): Success<T> {
    const result = parser(input);
    if (!result.success) {
        throw new Error(`Couldn't parse: ${input} with ${parser.name}`);
    }

    return result;
}
