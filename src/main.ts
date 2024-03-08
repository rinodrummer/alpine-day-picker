import Alpine from 'alpinejs';
import { DayPicker, Weekdays, Months } from '../lib/DayPicker.ts';
import { addWeeks, subWeeks } from './utils.ts';

declare global {
    interface Window {
        Alpine: typeof Alpine;
        Weekdays: typeof Weekdays;
        Months: typeof Months;

        addWeeks: typeof addWeeks;
        subWeeks: typeof subWeeks;
    }
}

Alpine.data('DayPicker', DayPicker);

window.Alpine = Alpine;
window.Weekdays = Weekdays;
window.Months = Months;

window.addWeeks = addWeeks;
window.subWeeks = subWeeks;

Alpine.start();
