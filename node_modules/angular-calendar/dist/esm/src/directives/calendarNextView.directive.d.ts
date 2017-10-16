import { EventEmitter } from '@angular/core';
/**
 * Change the view date to the next view. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarNextView
 *  [(viewDate)]="viewDate"
 *  [view]="view">
 *  Next
 * </button>
 * ```
 */
export declare class CalendarNextViewDirective {
    /**
     * The current view
     */
    view: string;
    /**
     * The current view date
     */
    viewDate: Date;
    /**
     * Called when the view date is changed
     */
    viewDateChange: EventEmitter<Date>;
    /**
     * @hidden
     */
    onClick(): void;
}
