import { EventEmitter, ChangeDetectorRef, OnChanges, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { WeekDay, CalendarEvent, WeekViewEvent, WeekViewEventRow } from 'calendar-utils';
import { ResizeEvent } from 'angular-resizable-element';
import { CalendarEventTimesChangedEvent } from '../../interfaces/calendarEventTimesChangedEvent.interface';
import { CalendarUtils } from '../../providers/calendarUtils.provider';
export interface WeekViewEventResize {
    originalOffset: number;
    originalSpan: number;
    edge: string;
}
/**
 * Shows all events on a given week. Example usage:
 *
 * ```typescript
 * <mwl-calendar-week-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-week-view>
 * ```
 */
export declare class CalendarWeekViewComponent implements OnChanges, OnInit, OnDestroy {
    private cdr;
    private utils;
    /**
     * The current view date
     */
    viewDate: Date;
    /**
     * An array of events to display on view
     * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
     */
    events: CalendarEvent[];
    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
     */
    excludeDays: number[];
    /**
     * An observable that when emitted on will re-render the current view
     */
    refresh: Subject<any>;
    /**
     * The locale used to format dates
     */
    locale: string;
    /**
     * The placement of the event tooltip
     */
    tooltipPlacement: string;
    /**
     * A custom template to use for the event tooltips
     */
    tooltipTemplate: TemplateRef<any>;
    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    tooltipAppendToBody: boolean;
    /**
     * The start number of the week
     */
    weekStartsOn: number;
    /**
     * A custom template to use to replace the header
     */
    headerTemplate: TemplateRef<any>;
    /**
     * A custom template to use for week view events
     */
    eventTemplate: TemplateRef<any>;
    /**
     * A custom template to use for event titles
     */
    eventTitleTemplate: TemplateRef<any>;
    /**
     * The precision to display events.
     * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
     */
    precision: 'days' | 'minutes';
    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that indicate which days are weekends
     */
    weekendDays: number[];
    /**
     * Called when a header week day is clicked. Adding a `cssClass` property on `$event.day` will add that class to the header element
     */
    dayHeaderClicked: EventEmitter<{
        day: WeekDay;
    }>;
    /**
     * Called when the event title is clicked
     */
    eventClicked: EventEmitter<{
        event: CalendarEvent;
    }>;
    /**
     * Called when an event is resized or dragged and dropped
     */
    eventTimesChanged: EventEmitter<CalendarEventTimesChangedEvent>;
    /**
     * An output that will be called before the view is rendered for the current week.
     * If you add the `cssClass` property to a day in the header it will add that class to the cell element in the template
     */
    beforeViewRender: EventEmitter<{
        header: WeekDay[];
    }>;
    /**
     * @hidden
     */
    days: WeekDay[];
    /**
     * @hidden
     */
    eventRows: WeekViewEventRow[];
    /**
     * @hidden
     */
    refreshSubscription: Subscription;
    /**
     * @hidden
     */
    currentResizes: Map<WeekViewEvent, WeekViewEventResize>;
    /**
     * @hidden
     */
    validateDrag: (args: any) => boolean;
    /**
     * @hidden
     */
    validateResize: (args: any) => boolean;
    /**
     * @hidden
     */
    dayColumnWidth: number;
    /**
     * @hidden
     */
    constructor(cdr: ChangeDetectorRef, utils: CalendarUtils, locale: string);
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnChanges(changes: any): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    /**
     * @hidden
     */
    resizeStarted(weekViewContainer: HTMLElement, weekEvent: WeekViewEvent, resizeEvent: ResizeEvent): void;
    /**
     * @hidden
     */
    resizing(weekEvent: WeekViewEvent, resizeEvent: ResizeEvent, dayWidth: number): void;
    /**
     * @hidden
     */
    resizeEnded(weekEvent: WeekViewEvent): void;
    /**
     * @hidden
     */
    eventDragged(weekEvent: WeekViewEvent, draggedByPx: number, dayWidth: number): void;
    /**
     * @hidden
     */
    getDayColumnWidth(eventRowContainer: HTMLElement): number;
    /**
     * @hidden
     */
    dragStart(weekViewContainer: HTMLElement, event: HTMLElement): void;
    private refreshHeader();
    private refreshBody();
    private refreshAll();
}
