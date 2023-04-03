import { TypedArray } from '../types';
/**
 * Tests a boolean expression and throws a message if false.
 */
export declare function assert(expr: boolean, msg: string | (() => string)): void;
export declare function assertShapesMatch(shapeA: number[], shapeB: number[], errorMessagePrefix?: string): void;
export declare function arraysEqual(n1: number[] | TypedArray, n2: number[] | TypedArray): boolean;
export declare const DECIMAL_PLACES_TO_CHECK = 4;
