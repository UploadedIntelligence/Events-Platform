export function pickKeys<TObject extends object, TKeys extends Array<keyof TObject>>(
    obj: TObject,
    keys: TKeys,
): { [K in GetArrayType<TKeys>]: TObject[K] } {
    let returnObj = {} as TObject;
    for (const key of keys) {
        if (Object.hasOwn(obj, key)) {
            returnObj[key] = obj[key];
        }
    }
    return returnObj;
}

type GetArrayType<T> = T extends Array<infer TArrayType> ? TArrayType : never;
