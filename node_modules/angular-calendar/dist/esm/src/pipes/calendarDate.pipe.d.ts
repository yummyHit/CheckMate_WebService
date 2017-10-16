import { PipeTransform } from '@angular/core';
import { CalendarDateFormatter } from './../providers/calendarDateFormatter.provider';
/**
 * This pipe is primarily for rendering the current view title. Example usage:
 * ```typescript
 * // where `viewDate` is a `Date` and view is `'month' | 'week' | 'day'`
 * {{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}
 * ```
 */
export declare class CalendarDatePipe implements PipeTransform {
    private dateFormatter;
    private locale;
    constructor(dateFormatter: CalendarDateFormatter, locale: string);
    transform(date: Date, method: string, locale?: string): string;
}
