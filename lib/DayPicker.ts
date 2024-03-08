import Alpine, { AlpineComponent } from 'alpinejs';

import {
    checkHolidays,
    doDaysCoincide,
    toUTCDate,
    Weekday,
    weeksBetween,
} from '../src/utils.ts';

interface IDayPicker {
    currentWeek: number;
    value: number | string | Date | null;

    readonly valueAsDate: Date | null;
    readonly today: Date;
    readonly firstDayOfTheCurrentWeek: Date;
    readonly daysOfTheWeek: Date[];
    readonly minWeeks: number;
    readonly maxWeeks: number;

    updateMinMax: () => Promise<void>;
    isSameDay: (d1: Date | null, d2: Date | null) => boolean;
    isDayAvailable: (day: Date) => boolean;
    firstDayOfTheWeek: (date: Date) => Date;
}

interface ComponentData {
    initialValue: Date | null;
    value: Date | null;
    currentWeek: number;
    minWeeks: number;
    maxWeeks: number;
    minDate: Date | null;
    maxDate: Date | null;
}

interface Options {
    startingDayOfTheWeek: number;
    excludedWeekdays: Weekday[] | Set<Weekday>;
    holidays: Date[];
}

const data = Alpine.reactive<ComponentData>({
    initialValue: null,
    value: null,
    currentWeek: 0,
    minWeeks: -Infinity,
    maxWeeks: Infinity,
    minDate: null,
    maxDate: null,
});

const defaultOptions: Options = {
    startingDayOfTheWeek: 0,
    excludedWeekdays: [],
    holidays: [],
};

export const Weekdays = Object.freeze({
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
});

export const Months = Object.freeze({
    JANUARY: 1,
    FEBRUARY: 2,
    MARCH: 3,
    APRIL: 4,
    MAY: 5,
    JUNE: 6,
    JULY: 7,
    AUGUST: 8,
    SEPTEMBER: 9,
    OCTOBER: 10,
    NOVEMBER: 11,
    DECEMBER: 12,
});

export const DayPicker = (
    input: HTMLInputElement,
    options: Partial<Options> = {}
): AlpineComponent<IDayPicker> => {
    options = Object.assign({}, defaultOptions, options);
    const excludedWeekdays = new Set(options.excludedWeekdays);

    return {
        get today() {
            return toUTCDate(new Date());
        },
        get firstDayOfTheCurrentWeek() {
            const date = this.firstDayOfTheWeek(
                data.initialValue ?? this.today
            );
            date.setDate(date.getDate() + data.currentWeek * 7);

            return date;
        },
        get daysOfTheWeek() {
            const firstDayOfTheWeek: Date = this.firstDayOfTheCurrentWeek;
            const days: Date[] = [firstDayOfTheWeek];

            for (let i = 1; i < 7; i++) {
                const day = new Date(firstDayOfTheWeek);
                day.setDate(day.getDate() + i);

                days.push(day);
            }

            return days;
        },

        get valueAsDate() {
            return data.value;
        },

        get value(): string | null {
            return this.valueAsDate?.toISOString().split('T')[0] ?? null;
        },
        set value(val: number | string | Date | null) {
            if (val == null) {
                data.value = null;
                return;
            }

            const date = toUTCDate(new Date(val));

            if (this.isDayAvailable(date)) {
                data.value = date;
            }
        },

        get currentWeek() {
            return data.currentWeek;
        },
        set currentWeek(week) {
            if (isFinite(data.minWeeks)) {
                week = Math.max(data.minWeeks, week);
            }

            if (isFinite(data.maxWeeks)) {
                week = Math.min(data.maxWeeks, week);
            }

            data.currentWeek = week;
        },

        get minWeeks() {
            return data.minWeeks;
        },

        get maxWeeks() {
            return data.maxWeeks;
        },

        async init() {
            if (input.value) {
                this.value = input.value;
            }

            if (this.valueAsDate) {
                data.initialValue ??= toUTCDate(new Date(this.valueAsDate));
            }

            await this.updateMinMax();
        },

        async updateMinMax() {
            await this.$nextTick(() => {
                const _min = input.getAttribute('min');
                const _max = input.getAttribute('max');

                if (_min) {
                    const minDate = toUTCDate(new Date(_min));
                    data.initialValue ??= minDate;

                    data.minWeeks =
                        Math.abs(weeksBetween(minDate, data.initialValue)) * -1;
                    data.minDate = minDate;
                }

                data.initialValue ??= this.today;

                if (_max) {
                    const maxDate = toUTCDate(new Date(_max));
                    data.maxWeeks = weeksBetween(maxDate, data.initialValue);
                    data.maxDate = maxDate;
                }
            });
        },

        isSameDay(d1, d2) {
            if (!d1 && !d2) {
                return true;
            }

            if (!d1 || !d2) {
                return false;
            }

            return doDaysCoincide(d1, d2);
        },

        isDayAvailable(day) {
            day = toUTCDate(day);

            if (data.minDate && day < data.minDate) {
                return false;
            }

            if (data.maxDate && day > data.maxDate) {
                return false;
            }

            return !(
                excludedWeekdays.has(day.getDay() as Weekday) ||
                checkHolidays(day, options.holidays)
            );
        },

        firstDayOfTheWeek(date) {
            const day = toUTCDate(date);
            let diff = day.getDay() - options.startingDayOfTheWeek;

            if (diff < 0) {
                diff += 7;
            }

            day.setDate(day.getDate() - diff);
            return day;
        },
    };
};
