import { Component, Input, Output, EventEmitter } from '@angular/core';
var CalendarAllDayEventComponent = /** @class */ (function () {
    function CalendarAllDayEventComponent() {
        this.eventClicked = new EventEmitter();
    }
    CalendarAllDayEventComponent.decorators = [
        { type: Component, args: [{
                    selector: 'mwl-calendar-all-day-event',
                    template: "\n    <ng-template\n      #defaultTemplate\n      let-event=\"event\"\n      let-eventClicked=\"eventClicked\">\n      <div\n        class=\"cal-all-day-event\"\n        [style.backgroundColor]=\"event.color.secondary\"\n        [style.borderColor]=\"event.color.primary\">\n        <mwl-calendar-event-actions [event]=\"event\"></mwl-calendar-event-actions>\n        <mwl-calendar-event-title\n          [event]=\"event\"\n          [customTemplate]=\"eventTitleTemplate\"\n          view=\"day\"\n          (mwlClick)=\"eventClicked.emit()\">\n        </mwl-calendar-event-title>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        event: event,\n        eventClicked: eventClicked\n      }\">\n    </ng-template>\n  "
                },] },
    ];
    /** @nocollapse */
    CalendarAllDayEventComponent.ctorParameters = function () { return []; };
    CalendarAllDayEventComponent.propDecorators = {
        'event': [{ type: Input },],
        'customTemplate': [{ type: Input },],
        'eventTitleTemplate': [{ type: Input },],
        'eventClicked': [{ type: Output },],
    };
    return CalendarAllDayEventComponent;
}());
export { CalendarAllDayEventComponent };
//# sourceMappingURL=calendarAllDayEvent.component.js.map