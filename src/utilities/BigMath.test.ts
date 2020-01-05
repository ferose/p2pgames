import { BigMath } from "./BigMath";
import Big from "big.js";

describe('BigMath', () => {
    test('min function', () => {
        expect(BigMath.min(Big(0), Big(1))).toEqual(Big(0));
        expect(BigMath.min(Big(123), Big(-234))).toEqual(Big(-234));
        expect(BigMath.min(Big(0), Big(0))).toEqual(Big(0));
        expect(BigMath.min(Big(234234), Big(234234))).toEqual(Big(234234));
        expect(BigMath.min(Big(-4), Big(-3454), Big(234234), Big(0), Big(23))).toEqual(Big(-3454));
    });

    test('max function', () => {
        expect(BigMath.max(Big(0), Big(1))).toEqual(Big(1));
        expect(BigMath.max(Big(123), Big(-234))).toEqual(Big(123));
        expect(BigMath.max(Big(0), Big(0))).toEqual(Big(0));
        expect(BigMath.max(Big(234234), Big(234234))).toEqual(Big(234234));
        expect(BigMath.max(Big(-4), Big(-3454), Big(234234), Big(0), Big(23))).toEqual(Big(234234));
    });

    test('mean function', () => {
        expect(BigMath.mean(Big(100), Big(200), Big(300))).toEqual(Big(200));
        expect(BigMath.mean(Big(-20), Big(20))).toEqual(Big(0));
    });
});
