import { nextWeekday, inNDays } from './dateConvertion';

it('in n days', () => {
    const feb15 = new Date(2019, 1, 15);

    const in5days = inNDays(5, feb15);
    expect(in5days.getDate()).toBe(20);
});

it.only('weekday tests', () => {
    const someFriday = new Date(2019, 1, 15);
    expect(someFriday.getDay()).toBe(5);
    const nextFriday = nextWeekday(5, someFriday);
    const nextSaturday = nextWeekday(6, someFriday);
    const nextSunday = nextWeekday(0, someFriday);
    const nextMonday = nextWeekday(1, someFriday);

    expect(nextFriday.getDay()).toBe(5);
    expect(nextFriday.getDate()).toBe(22);
    expect(nextSaturday.getDay()).toBe(6);
    expect(nextSunday.getDay()).toBe(0);
    expect(nextMonday.getDay()).toBe(1);
});
