import { InjectionToken } from '@angular/core';
import { CalendarDateFormatterInterface, DateFormatterParams } from '../interfaces/calendarDateFormatter.interface';
export declare const MOMENT: InjectionToken<string>;
/**
 * This will use <a href="http://momentjs.com/" target="_blank">moment</a> to do all date formatting. To use this class:
 *
 * ```typescript
 * import { CalendarDateFormatter, CalendarMomentDateFormatter, MOMENT } from 'angular-calendar';
 * import * as moment from 'moment';
 *
 * // in your component
 * provide: [{
 *   provide: MOMENT, useValue: moment
 * }, {
 *   provide: CalendarDateFormatter, useClass: CalendarMomentDateFormatter
 * }]
 *
 * ```
 */
export declare class CalendarMomentDateFormatter implements CalendarDateFormatterInterface {
    private moment;
    /**
     * @hidden
     */
    constructor(moment: any);
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
