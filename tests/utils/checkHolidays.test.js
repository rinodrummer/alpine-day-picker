import { it, expect, describe } from 'vitest';
import { checkHolidays } from '../../src/utils.ts';

describe('utils/checkHolidays', () => {
    it('returns false when no holidays are set', () => {
        const today = new Date();

        expect(checkHolidays(today, [])).toBe(false);
    });

    it("returns false when exact dates don't match", () => {
        const today = new Date();
        const yesterday = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            today.getDate() - 1
        );
        const tomorrow = new Date(
            today.getFullYear(),
            today.getMonth() - 1,
            today.getDate() + 1
        );

        expect(checkHolidays(today, [yesterday, tomorrow])).toBe(false);
    });

    it('returns true when the exact date matches', () => {
        const today = new Date();

        expect(checkHolidays(today, [today])).toBe(true);
    });

    it("doesn't stop when a holiday is invalid", () => {
        const today = new Date(2024, 2, 10);

        expect(checkHolidays(today, ['14-40', '10-23'])).toBe(false);
    });

    it('returns true when a flexible date matches a string', () => {
        const today = new Date(2024, 2, 10);

        expect(checkHolidays(today, ['03-10'])).toBe(true);
    });

    it('returns true when a flexible date matches an object', () => {
        const today = new Date(2024, 2, 10);

        expect(checkHolidays(today, [{ month: 3, day: 10 }])).toBe(true);
    });
});
