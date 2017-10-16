import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import startOfToday from 'date-fns/start_of_today';
/**
 * Change the view date to the current day. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarToday
 *  [(viewDate)]="viewDate">
 *  Today
 * </button>
 * ```
 */
var CalendarTodayDirective = /** @class */ (function () {
    function CalendarTodayDirective() {
        /**
         * Called when the view date is changed
         */
        this.viewDateChange = new EventEmitter();
    }
    /**
     * @hidden
     */
    CalendarTodayDirective.prototype.onClick = function () {
        this.viewDateChange.emit(startOfToday());
    };
    CalendarTodayDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[mwlCalendarToday]'
                },] },
    ];
    /** @nocollapse */
    CalendarTodayDirective.ctorParameters = function () { return []; };
    CalendarTodayDirective.propDecorators = {
        'viewDate': [{ type: Input },],
        'viewDateChange': [{ type: Output },],
        'onClick': [{ type: HostListener, args: ['click',] },],
    };
    return CalendarTodayDirective;
}());
export { CalendarTodayDirective };
//# sourceMappingURL=calendarToday.directive.js.map