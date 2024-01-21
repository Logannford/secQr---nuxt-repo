/**
 * https://dev.to/martinpersson/a-guide-to-using-the-option-type-in-typescript-ki2#the-problem-with-null-and-undefined
 */

// Define a generic type called 'Option' with a type parameter T
export type Option<T> = { kind: 'none' } | { kind: 'some'; value: T };

// Define a function 'none' that returns an Option with kind 'none'
// the functions return type is Option<T> - so we know that the return value
// will be an object with a kind property of type 'none' and not any string value
export function none<T>(): Option<T> {
  return { kind: 'none' };
}

// Define a function 'some' that takes a value of type T and returns an Option with kind 'some'
export function some<T>(value: T): Option<T> {
  return { kind: 'some', value };
}
