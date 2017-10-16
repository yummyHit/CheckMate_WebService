import { Injectable } from '@angular/core';
import { getMonthView, getWeekViewHeader, getWeekView, getDayView, getDayViewHourGrid } from 'calendar-utils';
var CalendarUtils = /** @class */ (function () {
    function CalendarUtils() {
    }
    CalendarUtils.prototype.getMonthView = function (args) {
        return getMonthView(args);
    };
    CalendarUtils.prototype.getWeekViewHeader = function (args) {
        return getWeekViewHeader(args);
    };
    CalendarUtils.prototype.getWeekView = function (args) {
        return getWeekView(args);
    };
    CalendarUtils.prototype.getDayView = function (args) {
        return getDayView(args);
    };
    CalendarUtils.prototype.getDayViewHourGrid = function (args) {
        return getDayViewHourGrid(args);
    };
    CalendarUtils.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CalendarUtils.ctorParameters = function () { return []; };
    return CalendarUtils;
}());
export { CalendarUtils };
//# sourceMappingURL=calendarUtils.provider.js.map