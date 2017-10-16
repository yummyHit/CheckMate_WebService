import { EventEmitter, TemplateRef } from '@angular/core';
import { WeekViewEvent } from 'calendar-utils';
export declare class CalendarWeekViewEventComponent {
    weekEvent: WeekViewEvent;
    tooltipPlacement: string;
    tooltipAppendToBody: boolean;
    customTemplate: TemplateRef<any>;
    eventTitleTemplate: TemplateRef<any>;
    tooltipTemplate: TemplateRef<any>;
    eventClicked: EventEmitter<any>;
}
