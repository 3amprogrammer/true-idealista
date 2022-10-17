import { isEqual, isPrimitive } from '@/utils/object';

export const asyncForEach = async <Type>(arr: Type[], callback: (arg: Type) => Promise<void>) => asyncMap(arr, callback);

export const asyncMap = async <Type>(arr: Type[], predicate: (arg: Type) => Promise<any>) =>
  Promise.all(arr.map(predicate));

export const asyncFilter = async <Type>(arr: Type[], predicate: (arg: Type) => Promise<boolean>) => {
  const results = await asyncMap(arr, predicate);

  return arr.filter((value, index) => results[index]);
};

export const asyncEvery = async <Type>(arr: Type[], predicate: (arg: Type) => Promise<boolean>) =>
  (await asyncFilter(arr, predicate)).length === arr.length;

export const asyncSome = async <Type>(arr: Type[], predicate: (arg: Type) => Promise<boolean>) =>
  (await asyncFilter(arr, predicate)).length > 0;

export const equals = <Type>(arrayA: Type[], arrayB: Type[]) => {
  if (arrayA.length !== arrayB.length) {
    return false;
  }

  return arrayA.every((elementA) => {
    if (isPrimitive(elementA)) {
      return arrayB.includes(elementA);
    }

    return arrayB.find((elementB) => isEqual(elementA, elementB));
  });
};