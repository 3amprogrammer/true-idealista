import { equals as arrayEquals } from '@/utils/array';

export const hasProperties = (object: object, props: string[]) => props.every(prop => object.hasOwnProperty(prop));

export const isFunction = (value: any) => typeof value === 'function';

export const isObject = (value: any) => typeof value === 'object'
  && value !== null
  && !Array.isArray(value);

export const isPrimitive = (value: any) => value === null || (
  !isObject(value)
  && !isFunction(value)
  && !Array.isArray(value)
);

export const isEqual = (valueA: any, valueB: any): boolean => {
  if (typeof valueA !== typeof valueB) {
    return false;
  }

  if (isPrimitive(valueA) && isPrimitive(valueB)) {
    return valueA === valueB;
  }

  if (Array.isArray(valueA) && Array.isArray(valueB)) {
    return arrayEquals(valueA, valueB);
  }

  if (!isObject(valueA) || !isObject(valueB)) {
    return false;
  }

  const objAKeys = Object.getOwnPropertyNames(valueA);
  const objBKeys = Object.getOwnPropertyNames(valueB);

  if (!arrayEquals(objAKeys, objBKeys)) {
    return false;
  }

  return objAKeys.every((key) => {
    return isEqual(valueA[key], valueB[key]);
  });
};
