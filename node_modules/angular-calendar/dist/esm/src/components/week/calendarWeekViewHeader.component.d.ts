import { EventEmitter, TemplateRef } from '@angular/core';
import { CalendarEvent, WeekDay } from 'calendar-utils';
export declare class CalendarWeekViewHeaderComponent {
    days: WeekDay[];
    locale: string;
    customTemplate: TemplateRef<any>;
    dayHeaderClicked: EventEmitter<{
        day: WeekDay;
    }>;
    eventDropped: EventEmitter<{
        event: CalendarEvent;
        newStart: Date;
    }>;
}
