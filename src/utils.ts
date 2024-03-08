import { Months, Weekdays } from '../lib/DayPicker.ts';

export type Weekday = (typeof Weekdays)[keyof typeof Weekdays];
export type Month = (typeof Months)[keyof typeof Months];

export type Holiday =
    | Date
    | `${Month}-${number}`
    | { month: Month; day: number };

export function toUTCDate(date: Date): Date {
    return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
}

export function doDaysCoincide(d1: Date, d2: Date): boolean {
    d1 = toUTCDate(d1);
    d2 = toUTCDate(d2);

    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

export function checkHolidays(date: Date, holidays: Holiday[] = []): boolean {
    for (let holiday of holidays) {
        if (holiday instanceof Date) {
            return doDaysCoincide(date, holiday);
        }

        date = toUTCDate(date);

        let month = null;
        let day = null;

        switch (typeof holiday) {
            case 'string':
                [month, day] = holiday.split('-');
                break;
            case 'object':
                month = holiday.month;
                day = holiday.day;
                break;
            default:
                return false;
        }

        holiday = toUTCDate(new Date(1970, Number(month) - 1, Number(day)));

        if (isNaN(holiday.getTime())) {
            continue;
        }

        if (
            date.getMonth() === holiday.getMonth() &&
            date.getDate() === holiday.getDate()
        ) {
            return true;
        }
    }

    return false;
}

export function weeksBetween(fromDate: Date, toDate: Date): number {
    return Math.trunc(
        (fromDate.getTime() - toDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
}

export function addWeeks(date: Date, weeks: number): Date {
    date.setDate(date.getDate() + weeks * 7);

    return date;
}

export function subWeeks(date: Date, weeks: number): Date {
    return addWeeks(date, Math.abs(weeks) * -1);
}
