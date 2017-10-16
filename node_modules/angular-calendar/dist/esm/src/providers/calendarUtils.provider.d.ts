import { GetMonthViewArgs, MonthView, GetWeekViewHeaderArgs, WeekDay, GetWeekViewArgs, WeekViewEventRow, GetDayViewArgs, DayView, GetDayViewHourGridArgs, DayViewHour } from 'calendar-utils';
export declare class CalendarUtils {
    getMonthView(args: GetMonthViewArgs): MonthView;
    getWeekViewHeader(args: GetWeekViewHeaderArgs): WeekDay[];
    getWeekView(args: GetWeekViewArgs): WeekViewEventRow[];
    getDayView(args: GetDayViewArgs): DayView;
    getDayViewHourGrid(args: GetDayViewHourGridArgs): DayViewHour[];
}
