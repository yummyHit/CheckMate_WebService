import { CalendarDateFormatterInterface, DateFormatterParams } from './../interfaces/calendarDateFormatter.interface';
/**
 * This will use <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to do all date formatting. It is the default date formatter used by the calendar.
 *
 * You will need to include a <a href="https://github.com/andyearnshaw/Intl.js/">polyfill</a> for older browsers.
 */
export declare class CalendarNativeDateFormatter implements CalendarDateFormatterInterface {
    /**
     * The month view header week day labels
     */
    monthViewColumnHeader({date, locale}: DateFormatterParams): string;
    /**
     * The month view cell day number
     */
    monthViewDayNumber({date, locale}: DateFormatterParams): string;
    /**
     * The month view title
     */
    monthViewTitle({date, locale}: DateFormatterParams): string;
    /**
     * The week view header week day labels
     */
    weekViewColumnHeader({date, locale}: DateFormatterParams): string;
    /**
     * The week view sub header day and month labels
     */
    weekViewColumnSubHeader({date, locale}: DateFormatterParams): string;
    /**
     * The week view title
     */
    weekViewTitle({date, locale}: DateFormatterParams): string;
    /**
     * The time formatting down the left hand side of the day view
     */
    dayViewHour({date, locale}: DateFormatterParams): string;
    /**
     * The day view title
     */
    dayViewTitle({date, locale}: DateFormatterParams): string;
}
