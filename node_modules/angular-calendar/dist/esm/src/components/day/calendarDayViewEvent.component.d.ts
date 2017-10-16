import { EventEmitter, TemplateRef } from '@angular/core';
import { DayViewEvent } from 'calendar-utils';
export declare class CalendarDayViewEventComponent {
    dayEvent: DayViewEvent;
    tooltipPlacement: string;
    tooltipAppendToBody: boolean;
    customTemplate: TemplateRef<any>;
    eventTitleTemplate: TemplateRef<any>;
    tooltipTemplate: TemplateRef<any>;
    eventClicked: EventEmitter<any>;
}
