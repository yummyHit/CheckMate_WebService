import { EventEmitter, TemplateRef } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
export declare class CalendarAllDayEventComponent {
    event: CalendarEvent;
    customTemplate: TemplateRef<any>;
    eventTitleTemplate: TemplateRef<any>;
    eventClicked: EventEmitter<any>;
}
