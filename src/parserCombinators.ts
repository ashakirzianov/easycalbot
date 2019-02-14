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
export function and<T>(...ps: Array<Parser<any>>): Parser<any[]> {
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
export function seq<TI>(...ps: Array<Parser<any>>): Parser<any[]> {
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
export function choice<TI>(...ps: Array<Parser<any>>): Parser<any[]> {
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
export function projectLast<TI>(parser: Parser<any>): Parser<any> {
    return translate(parser, result => result[result.length - 1]);
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

function bite(str: string, length: number) {
    return str.substring(length);
}

export function prefix(pre: string): Parser<string> {
    return input => input.toLocaleLowerCase().startsWith(pre.toLocaleLowerCase())
        ? success(pre, input.substring(pre.length))
        : fail(`${input} does not start with ${pre}`)
        ;
}

export function regex(re: RegExp): Parser<string> {
    const actualRe = new RegExp('^' + re, 'i');
    return input => {
        const match = input.match(actualRe);

        return match !== null
            ? success(match[0], input.substring(match[0].length))
            : fail(`${input} does not match ${re}`)
            ;
    };
}
