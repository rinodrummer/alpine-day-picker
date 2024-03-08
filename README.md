# Day Picker - Alpine.js

> [!WARNING]  
> This component is still **work in progress**, may not work properly in
> international contexts and present unsolved issues.

## How to use this component

Import the component and register it using `Alpine.data()`:

```js
import Alpine from 'alpinejs';
import { DayPicker } from 'alpine-day-picker';

Alpine.data('DayPicker', DayPicker);

Alpine.start();
```

...and use it wherever you need it!

```html
<div x-data="DayPicker($refs.dayInput)">
    <input type="date" x-model="value" x-ref="dayInput">
    
    <template x-for="day of daysOfTheWeek" :key="day.getTime()">
        <a href="#" role="button" x-on:click.prevent="value = day" x-bind:aria-disabled="!isDayAvailable(day)">
            <div>
                <span x-text="day.getDate()"></span>
                <span x-text="day.toLocaleString('en', { month: 'long' })"></span>
                <span x-text="day.getFullYear()"></span>
                <span x-text="day.toLocaleString('en', { weekday: 'long' })"></span>
            </div>
        </a>
    </template>
</div>
```
## Choose your structure

The component lets you decide how to control and display the days of the week; right 
now it comes unstyled to freely adapt to every need.

_So customize it as you prefer!_

## Adapts to your needs

```js
DayPicker($refs.dayInput, {
    startingDayOfTheWeek: 1,
    excludedWeekdays: [ 0, ],
    holidays: [
        new Date(2024, 2, 8), // Add a fixed date
        '12-25', // Or flexible ones as strings...
        { month: 1, day: 1 }, // ...and objects!
    ],
})
```

Or you can use take advantage of some utility enums that may result useful:

```js
// main.js
import Alpine from 'alpinejs';
import { DayPicker, Months, Weekdays } from 'alpine-day-picker';

Alpine.data('DayPicker', DayPicker);

window.Months = Months;
window.Weekdays = Weekdays;

Alpine.start();

// In your x-data
DayPicker($refs.dayInput, {
    startingDayOfTheWeek: Weekdays.MONDAY,
    excludedWeekdays: [ Weekdays.SUNDAY, ],
    holidays: [
        new Date(2024, 2, 8), // Add a fixed date
        '12-25', // Or flexible ones as strings...
        { month: Months.JANUARY, day: 1 }, // ...and objects!
    ],
})
```

## How to ensure date is valid

When the date input has a `min` and/or a `max`, the component will let you limit the
selection of these elements (if you desire) by considering them unavailable (like
holidays or excluded weekdays).

> [!CAUTION]  
> Right now, these fields are not dynamic, so you need to call the `updateMinMax()`
> method to refresh them.
