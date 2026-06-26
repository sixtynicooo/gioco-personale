export type Nullable<T> = T | null;

export const isNull = <T>(obj: T | null): obj is null =>
    obj === null;

export const isUndefined = <T>(obj: T | undefined): obj is undefined =>
    obj === undefined;

export const isNullUndefined = <T>(
    obj: T | null | undefined
): obj is null | undefined =>
    obj == null;