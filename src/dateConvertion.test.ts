import { nextWeekday, inNDays } from './dateConvertion';
import moment = require('moment');

it('in n days', () => {
    const feb15 = moment([2019, 1, 15]);

    const in5days = inNDays(5, feb15);
    expect(in5days.date()).toBe(20);
});

it('weekday tests', () => {
    const someFriday = moment([2019, 1, 15]);
    expect(someFriday.day()).toBe(5);
    const nextFriday = nextWeekday(5, someFriday);
    const nextSaturday = nextWeekday(6, someFriday);
    const nextSunday = nextWeekday(0, someFriday);
    const nextMonday = nextWeekday(1, someFriday);

    expect(nextFriday.day()).toBe(5);
    expect(nextFriday.date()).toBe(22);
    expect(nextSaturday.day()).toBe(6);
    expect(nextSunday.day()).toBe(0);
    expect(nextMonday.day()).toBe(1);
});
