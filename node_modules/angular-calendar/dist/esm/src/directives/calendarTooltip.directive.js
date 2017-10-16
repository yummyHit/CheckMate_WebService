import { Directive, Component, HostListener, Input, Injector, ComponentFactoryResolver, ViewContainerRef, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Positioning } from 'positioning';
var CalendarTooltipWindowComponent = /** @class */ (function () {
    function CalendarTooltipWindowComponent() {
    }
    CalendarTooltipWindowComponent.decorators = [
        { type: Component, args: [{
                    template: "\n    <ng-template\n      #defaultTemplate\n      let-contents=\"contents\"\n      let-placement=\"placement\"\n      let-event=\"event\">\n      <div class=\"cal-tooltip\" [ngClass]=\"'cal-tooltip-' + placement\">\n        <div class=\"cal-tooltip-arrow\"></div>\n        <div class=\"cal-tooltip-inner\" [innerHtml]=\"contents\"></div>\n      </div>\n    </ng-template>\n    <ng-template\n      [ngTemplateOutlet]=\"customTemplate || defaultTemplate\"\n      [ngTemplateOutletContext]=\"{\n        contents: contents,\n        placement: placement,\n        event: event\n      }\">\n    </ng-template>\n  "
                },] },
    ];
    /** @nocollapse */
    CalendarTooltipWindowComponent.ctorParameters = function () { return []; };
    CalendarTooltipWindowComponent.propDecorators = {
        'contents': [{ type: Input },],
        'placement': [{ type: Input },],
        'event': [{ type: Input },],
        'customTemplate': [{ type: Input },],
    };
    return CalendarTooltipWindowComponent;
}());
export { CalendarTooltipWindowComponent };
var CalendarTooltipDirective = /** @class */ (function () {
    function CalendarTooltipDirective(elementRef, injector, renderer, componentFactoryResolver, viewContainerRef, document //tslint:disable-line
    ) {
        this.elementRef = elementRef;
        this.injector = injector;
        this.renderer = renderer;
        this.viewContainerRef = viewContainerRef;
        this.document = document; //tslint:disable-line
        this.placement = 'top'; // tslint:disable-line no-input-rename
        this.positioning = new Positioning();
        this.tooltipFactory = componentFactoryResolver.resolveComponentFactory(CalendarTooltipWindowComponent);
    }
    CalendarTooltipDirective.prototype.ngOnDestroy = function () {
        this.hide();
    };
    CalendarTooltipDirective.prototype.onMouseOver = function () {
        this.show();
    };
    CalendarTooltipDirective.prototype.onMouseOut = function () {
        this.hide();
    };
    CalendarTooltipDirective.prototype.show = function () {
        var _this = this;
        if (!this.tooltipRef && this.contents) {
            this.tooltipRef = this.viewContainerRef.createComponent(this.tooltipFactory, 0, this.injector, []);
            this.tooltipRef.instance.contents = this.contents;
            this.tooltipRef.instance.placement = this.placement;
            this.tooltipRef.instance.customTemplate = this.customTemplate;
            this.tooltipRef.instance.event = this.event;
            if (this.appendToBody) {
                this.document.body.appendChild(this.tooltipRef.location.nativeElement);
            }
            requestAnimationFrame(function () {
                _this.positionTooltip();
            });
        }
    };
    CalendarTooltipDirective.prototype.hide = function () {
        if (this.tooltipRef) {
            this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.tooltipRef.hostView));
            this.tooltipRef = null;
        }
    };
    CalendarTooltipDirective.prototype.positionTooltip = function () {
        if (this.tooltipRef) {
            var targetPosition = this.positioning.positionElements(this.elementRef.nativeElement, this.tooltipRef.location.nativeElement.children[0], this.placement, this.appendToBody);
            var elm = this.tooltipRef.location.nativeElement
                .children[0];
            this.renderer.setStyle(elm, 'top', targetPosition.top + "px");
            this.renderer.setStyle(elm, 'left', targetPosition.left + "px");
        }
    };
    CalendarTooltipDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[mwlCalendarTooltip]'
                },] },
    ];
    /** @nocollapse */
    CalendarTooltipDirective.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Injector, },
        { type: Renderer2, },
        { type: ComponentFactoryResolver, },
        { type: ViewContainerRef, },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
    ]; };
    CalendarTooltipDirective.propDecorators = {
        'contents': [{ type: Input, args: ['mwlCalendarTooltip',] },],
        'placement': [{ type: Input, args: ['tooltipPlacement',] },],
        'customTemplate': [{ type: Input, args: ['tooltipTemplate',] },],
        'event': [{ type: Input, args: ['tooltipEvent',] },],
        'appendToBody': [{ type: Input, args: ['tooltipAppendToBody',] },],
        'onMouseOver': [{ type: HostListener, args: ['mouseenter',] },],
        'onMouseOut': [{ type: HostListener, args: ['mouseleave',] },],
    };
    return CalendarTooltipDirective;
}());
export { CalendarTooltipDirective };
//# sourceMappingURL=calendarTooltip.directive.js.map