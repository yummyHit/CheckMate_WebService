import { OnDestroy, Injector, ComponentFactoryResolver, ViewContainerRef, ElementRef, Renderer2, TemplateRef } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
export declare class CalendarTooltipWindowComponent {
    contents: string;
    placement: string;
    event: CalendarEvent;
    customTemplate: TemplateRef<any>;
}
export declare class CalendarTooltipDirective implements OnDestroy {
    private elementRef;
    private injector;
    private renderer;
    private viewContainerRef;
    private document;
    contents: string;
    placement: string;
    customTemplate: TemplateRef<any>;
    event: CalendarEvent;
    appendToBody: boolean;
    private tooltipFactory;
    private tooltipRef;
    private positioning;
    constructor(elementRef: ElementRef, injector: Injector, renderer: Renderer2, componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, document: any);
    ngOnDestroy(): void;
    onMouseOver(): void;
    onMouseOut(): void;
    private show();
    private hide();
    private positionTooltip();
}
