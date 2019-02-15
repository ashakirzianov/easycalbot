export function mapAndConcat<T, U>(arr: T[], f: (o: T) => U[]): U[] {
    return arr
        .map(f)
        .reduce((acc, xs) => acc.concat(xs));
}
