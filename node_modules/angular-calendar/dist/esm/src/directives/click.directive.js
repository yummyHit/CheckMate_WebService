import { Directive, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
var ClickDirective = /** @class */ (function () {
    function ClickDirective(renderer, elm) {
        this.renderer = renderer;
        this.elm = elm;
        this.click = new EventEmitter(); // tslint:disable-line
    }
    ClickDirective.prototype.ngOnInit = function () {
        var _this = this;
        var eventName = typeof window['Hammer'] !== 'undefined' ? 'tap' : 'click';
        this.removeListener = this.renderer.listen(this.elm.nativeElement, eventName, function (event) {
            _this.click.next(event);
        });
    };
    ClickDirective.prototype.ngOnDestroy = function () {
        this.removeListener();
    };
    ClickDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[mwlClick]'
                },] },
    ];
    /** @nocollapse */
    ClickDirective.ctorParameters = function () { return [
        { type: Renderer2, },
        { type: ElementRef, },
    ]; };
    ClickDirective.propDecorators = {
        'click': [{ type: Output, args: ['mwlClick',] },],
    };
    return ClickDirective;
}());
export { ClickDirective };
//# sourceMappingURL=click.directive.js.map