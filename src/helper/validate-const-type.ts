/**
 * Deep freeze một object bất kỳ (runtime immutability)
 */
export const deepFreeze = <T>(obj: T): Readonly<T> => {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (
      value &&
      (typeof value === "object" || typeof value === "function") &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });
  return obj;
};

/**
 * Helper generic để tạo dữ liệu bất biến, có type-safe
 */
export const makeConstData = <TSchema>(
  data: Record<string, TSchema>
): Readonly<Record<string, TSchema>> => {
  return deepFreeze(data);
};
