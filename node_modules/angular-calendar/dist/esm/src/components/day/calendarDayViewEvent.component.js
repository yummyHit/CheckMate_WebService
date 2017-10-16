import { Component, Input, Output, EventEmitter } from '@angular/core';
var CalendarDayViewEventComponent = /** @class */ (function () {
    function CalendarDayViewEventComponent() {
        this.eventClicked = new EventEmitter();
    }
    CalendarDayViewEventComponent.decorators = [
        { type: Component, args: [{
                    selector: 'mwl-calendar-day-view-event',
                    template: "\n    <ng-template\n      #defaultTemplate\n      let-dayEvent=\"dayEvent\"\n      let-tooltipPlacement=\"tooltipPlacement\"\n      let-eventClicked=\"eventClicked\"\n      let-tooltipTemplate=\"tooltipTemplate\"\n      let-tooltipAppendToBody=\"tooltipAppendToBody\">\n      <div\n        class=\"cal-event\"\n        [style.backgroundColor]=\"dayEvent.event.color.secondary\"\n        [style.borderColor]=\"dayEvent.event.color.primary\"\n        [mwlCalendarTooltip]=\"dayEvent.event.title | calendarEventTitle:'dayTooltip':dayEvent.event\"\n        [tooltipPlacement]=\"tooltipPlacement\"\n        [tooltipEvent]=\"dayEvent.event\"\n        [tooltipTemplate]=\"tooltipTemplate\"\n        [tooltipAppendToBody]=\"tooltipAppendToBody\">\n        <mwl-calendar-event-actions [event]=\"dayEvent.event\"></mwl-calendar-event-actions>\n        <mwl-calendar-event-title\n          [event]=\"dayEvent.event\"\n          [customTemplate]=\"eventTitleTemplate\"\n          view=\"day\"\n          (mwlClick)=\"eventClicked.emit()\">\n        </mwl-calendar-event-title>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        dayEvent: dayEvent,\n        tooltipPlacement: tooltipPlacement,\n        eventClicked: eventClicked,\n        tooltipTemplate: tooltipTemplate,\n        tooltipAppendToBody: tooltipAppendToBody\n      }\">\n    </ng-template>\n  "
                },] },
    ];
    /** @nocollapse */
    CalendarDayViewEventComponent.ctorParameters = function () { return []; };
    CalendarDayViewEventComponent.propDecorators = {
        'dayEvent': [{ type: Input },],
        'tooltipPlacement': [{ type: Input },],
        'tooltipAppendToBody': [{ type: Input },],
        'customTemplate': [{ type: Input },],
        'eventTitleTemplate': [{ type: Input },],
        'tooltipTemplate': [{ type: Input },],
        'eventClicked': [{ type: Output },],
    };
    return CalendarDayViewEventComponent;
}());
export { CalendarDayViewEventComponent };
//# sourceMappingURL=calendarDayViewEvent.component.js.map