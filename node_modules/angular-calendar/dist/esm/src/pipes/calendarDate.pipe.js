import { Pipe, LOCALE_ID, Inject } from '@angular/core';
import { CalendarDateFormatter } from './../providers/calendarDateFormatter.provider';
/**
 * This pipe is primarily for rendering the current view title. Example usage:
 * ```typescript
 * // where `viewDate` is a `Date` and view is `'month' | 'week' | 'day'`
 * {{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}
 * ```
 */
var CalendarDatePipe = /** @class */ (function () {
    function CalendarDatePipe(dateFormatter, locale) {
        this.dateFormatter = dateFormatter;
        this.locale = locale;
    }
    CalendarDatePipe.prototype.transform = function (date, method, locale) {
        if (locale === void 0) { locale = this.locale; }
        return this.dateFormatter[method]({ date: date, locale: locale });
    };
    CalendarDatePipe.decorators = [
        { type: Pipe, args: [{
                    name: 'calendarDate'
                },] },
    ];
    /** @nocollapse */
    CalendarDatePipe.ctorParameters = function () { return [
        { type: CalendarDateFormatter, },
        { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
    ]; };
    return CalendarDatePipe;
}());
export { CalendarDatePipe };
//# sourceMappingURL=calendarDate.pipe.js.map