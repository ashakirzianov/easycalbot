export type Parser<TOut> = (input: string) => Result<TOut>;
export type Success<Out> = {
    value: Out,
    next: string,
    success: true,
};
export type FailReasonSingle = string;
export type FailReasonCompound = { reasons: FailReason[] };
export type FailReasonTagged = { tag: string, reason: FailReason };
export type FailReason = FailReasonSingle | FailReasonCompound | FailReasonTagged;
export type Fail = {
    success: false,
    reason: FailReason,
};
export type Result<Out> = Success<Out> | Fail;

export function fail(reason: FailReason): Fail {
    return { success: false, reason: reason };
}

export function success<TOut>(value: TOut, next: string): Success<TOut> {
    return { value, next, success: true };
}

export function not(parser: Parser<any>): Parser<{}> {
    return input => {
        const result = parser(input);
        return !result.success
            ? success({}, input)
            : fail('not: parser succeed');
    };
}

export function and<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<[T1, T2]>;
export function and<T1, T2, T3>(p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>): Parser<[T1, T2, T3]>;
export function and<T1, T2, T3, T4>(p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>, p4: Parser<T4>): Parser<[T1, T2, T3, T4]>;
export function and<T>(...ps: Array<Parser<T>>): Parser<T[]>;
export function and(...ps: Array<Parser<any>>): Parser<any[]> {
    return input => {
        const results: any[] = [];
        let lastInput = input;
        for (let i = 0; i < ps.length; i++) {
            const result = ps[i](input);
            if (!result.success) {
                return result;
            }
            results.push(result.value);
            lastInput = result.next;
        }

        return success(results, input);
    };
}

export function seq<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<[T1, T2]>;
export function seq<T1, T2, T3>(p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>): Parser<[T1, T2, T3]>;
export function seq<T1, T2, T3, T4>(p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>, p4: Parser<T4>): Parser<[T1, T2, T3, T4]>;

export function seq<T1, T2, T3, T4, T5>(p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>, p4: Parser<T4>, p5: Parser<T5>): Parser<[T1, T2, T3, T4, T5]>;
export function seq<T>(...ps: Array<Parser<T>>): Parser<T>;
export function seq(...ps: Array<Parser<any>>): Parser<any[]> {
    return input => {
        let currentInput = input;
        const results: any[] = [];
        for (let i = 0; i < ps.length; i++) {
            const result = ps[i](currentInput);
            if (!result.success) {
                return result;
            }
            results.push(result.value);
            currentInput = result.next;
        }

        return success(results, currentInput);
    };
}

export function choice<T1, T2>(p1: Parser<T1>, p2: Parser<T2>): Parser<T1 | T2>;
export function choice<T1, T2, T3>(p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>): Parser<T1 | T2 | T3>;
export function choice<T1, T2, T3, T4>(
    p1: Parser<T1>, p2: Parser<T2>, p3: Parser<T3>, p4: Parser<T4>
): Parser<T1 | T2 | T3 | T4>;
export function choice<T>(...ps: Array<Parser<T>>): Parser<T>;
export function choice(...ps: Array<Parser<any>>): Parser<any> {
    return input => {
        const failReasons: FailReason[] = [];
        for (let i = 0; i < ps.length; i++) {
            const result = ps[i](input);
            if (result.success) {
                return result;
            }
            failReasons.push(result.reason);
        }

        return fail({ reasons: failReasons });
    };
}

export function projectLast<T1, T2>(parser: Parser<[T1, T2]>): Parser<T2>;
export function projectLast<T1, T2, T3>(parser: Parser<[T1, T2, T3]>): Parser<T3>;
export function projectLast<T>(parser: Parser<T[]>): Parser<T>;
export function projectLast(parser: Parser<any>): Parser<any> {
    return translate(parser, result => result[result.length - 1]);
}

export function projectFirst<T1, T2>(parser: Parser<[T1, T2]>): Parser<T1>;
export function projectFirst<T1, T2, T3>(parser: Parser<[T1, T2, T3]>): Parser<T1>;
export function projectFirst<T>(parser: Parser<T[]>): Parser<T>;
export function projectFirst(parser: Parser<any>): Parser<any> {
    return translate(parser, result => result[0]);
}

export function maybe<T>(parser: Parser<T>): Parser<T | undefined> {
    return input => {
        const result = parser(input);
        return result.success
            ? result
            : success(undefined, input);
    };
}

export function some<T>(parser: Parser<T>): Parser<T[]> {
    return input => {
        const results: T[] = [];
        let currentInput = input;
        let currentResult: Result<T>;
        do {
            currentResult = parser(currentInput);
            if (currentResult.success) {
                results.push(currentResult.value);
                currentInput = currentResult.next;
            }
        } while (currentResult.success);

        return success(results, currentInput);
    };
}

// TODO: implement proper reason reporting
export function oneOrMore<T>(parser: Parser<T>): Parser<T[]> {
    return translate(some(parser), nodes => nodes.length > 0 ? nodes : null);
}

export function translate<From, To>(parser: Parser<From>, f: (from: From) => To | null): Parser<To> {
    return input => {
        const from = parser(input);
        if (from.success) {
            const translated = f(from.value);
            return translated === null
                ? fail('translate: result rejected by transform function')
                : success(translated, from.next);
        } else {
            return from;
        }
    };
}

export function report<TOut>(tag: string, parser: Parser<TOut>): Parser<TOut> {
    return (input: string) => {
        const result = parser(input);
        return result.success ? result : fail({
            tag: tag,
            reason: result.reason,
        });
    };
}

export function skipTo<TO>(parser: Parser<TO>): Parser<TO> {
    return projectLast(seq(
        some(not(parser)),
        parser,
    ));
}

export function iff<T>(parser: Parser<T>, predicate: (o: T) => boolean): Parser<T> {
    return input => {
        const result = parser(input);
        if (result.success) {
            return predicate(result.value)
                ? result
                : fail(`Value doesn't meat the condition: ${result.value}`);
        } else {
            return result;
        }
    };
}

export function ifDefined<T>(parser: Parser<T | undefined>): Parser<T> {
    return iff(parser, x => x !== undefined) as Parser<T>;
}

export function prefix(pref: string): Parser<string> {
    const lowerPref = pref.toLocaleLowerCase();
    return input => input.toLocaleLowerCase().startsWith(lowerPref)
        ? success(lowerPref, input.substring(lowerPref.length))
        : fail(`${input} does not start with ${lowerPref}`)
        ;
}

export function regex(re: RegExp): Parser<string> {
    const actualRe = new RegExp('^' + re.source, 'i');
    return input => {
        const match = input.match(actualRe);

        return match !== null
            ? success(match[0], input.substring(match[0].length))
            : fail(`${input} does not match ${re}`)
            ;
    };
}

export function prefixes(...ps: string[]): Parser<string> {
    const parsers = ps.map(prefix);
    return choice(...parsers);
}

export const decimal: Parser<number> = translate(regex(/\d+/), s => parseInt(s, 10));
export const whitespaces = regex(/\s+/);
export function trimS<T>(parser: Parser<T>): Parser<T> {
    return projectLast(seq(maybe(whitespaces), parser));
}

export function trimE<T>(parser: Parser<T>): Parser<T> {
    return projectFirst(seq(parser, maybe(whitespaces)));
}

export function trim<T>(parser: Parser<T>): Parser<T> {
    return translate(
        seq(maybe(whitespaces), parser, maybe(whitespaces)),
        ([_, r, __]) => r,
    );
}

export function anything(input: string): Result<string> {
    return success(input, '');
}
