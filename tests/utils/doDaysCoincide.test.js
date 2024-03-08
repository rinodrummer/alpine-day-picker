import { expect, test, describe } from 'vitest';
import { doDaysCoincide } from '../../src/utils.js';

describe('utils/doDaysCoincide', () => {
    test("different dates don't coincide", () => {
        const d1 = new Date();
        const d2 = new Date(1970, 0, 1);

        expect(doDaysCoincide(d1, d2)).toBe(false);
    });

    test('same dates coincide', () => {
        const d1 = new Date();
        const d2 = new Date();

        expect(doDaysCoincide(d1, d2)).toBe(true);
    });

    test('same dates coincide even with different time', () => {
        const d1 = new Date(1970, 0, 1, 0, 0, 0, 0);
        const d2 = new Date(1970, 0, 1, 1, 0, 0, 0);
        const d3 = new Date(1970, 0, 1, 23, 59, 59, 999);

        expect(doDaysCoincide(d1, d2)).toBe(true);

        expect(doDaysCoincide(d2, d3)).toBe(true);

        expect(doDaysCoincide(d1, d3)).toBe(true);
    });
});
