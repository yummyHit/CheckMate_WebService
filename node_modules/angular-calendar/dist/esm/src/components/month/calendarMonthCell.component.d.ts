import { EventEmitter, TemplateRef } from '@angular/core';
import { MonthViewDay, CalendarEvent } from 'calendar-utils';
export declare class CalendarMonthCellComponent {
    day: MonthViewDay;
    openDay: MonthViewDay;
    locale: string;
    tooltipPlacement: string;
    tooltipAppendToBody: boolean;
    customTemplate: TemplateRef<any>;
    tooltipTemplate: TemplateRef<any>;
    highlightDay: EventEmitter<any>;
    unhighlightDay: EventEmitter<any>;
    eventClicked: EventEmitter<{
        event: CalendarEvent;
    }>;
    /**
     * @hidden
     */
    onEventClick(mouseEvent: MouseEvent, calendarEvent: CalendarEvent): void;
}
