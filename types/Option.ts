/**
 * https://dev.to/martinpersson/a-guide-to-using-the-option-type-in-typescript-ki2#the-problem-with-null-and-undefined
 */

// Define a generic type called 'Option' with a type parameter T
export type Option<T> = { kind: 'none' } | { kind: 'some'; value: T };

// Define a function 'none' that returns an Option with kind 'none'
export function none<T>(): Option<T> {
  return { kind: 'none' };
}

// Define a function 'some' that takes a value of type T and returns an Option with kind 'some'
export function some<T>(value: T): Option<T> {
  return { kind: 'some', value };
}
