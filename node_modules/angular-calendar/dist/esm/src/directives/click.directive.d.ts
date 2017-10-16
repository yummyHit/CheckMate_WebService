import { Renderer2, ElementRef, OnInit, OnDestroy, EventEmitter } from '@angular/core';
export declare class ClickDirective implements OnInit, OnDestroy {
    private renderer;
    private elm;
    click: EventEmitter<MouseEvent>;
    private removeListener;
    constructor(renderer: Renderer2, elm: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
