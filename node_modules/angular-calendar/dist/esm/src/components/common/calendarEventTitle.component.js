import { Component, Input } from '@angular/core';
var CalendarEventTitleComponent = /** @class */ (function () {
    function CalendarEventTitleComponent() {
    }
    CalendarEventTitleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'mwl-calendar-event-title',
                    template: "\n    <ng-template\n      #defaultTemplate\n      let-event=\"event\"\n      let-view=\"view\">\n      <a\n        class=\"cal-event-title\"\n        href=\"javascript:;\"\n        [innerHTML]=\"event.title | calendarEventTitle:view:event\">\n      </a>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        event: event,\n        view: view\n      }\">\n    </ng-template>\n  "
                },] },
    ];
    /** @nocollapse */
    CalendarEventTitleComponent.ctorParameters = function () { return []; };
    CalendarEventTitleComponent.propDecorators = {
        'event': [{ type: Input },],
        'customTemplate': [{ type: Input },],
        'view': [{ type: Input },],
    };
    return CalendarEventTitleComponent;
}());
export { CalendarEventTitleComponent };
//# sourceMappingURL=calendarEventTitle.component.js.map