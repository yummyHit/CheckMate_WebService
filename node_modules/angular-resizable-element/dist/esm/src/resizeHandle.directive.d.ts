import { Renderer2, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { Resizable } from './resizable.directive';
import { Edges } from './interfaces/edges.interface';
/**
 * An element placed inside a `mwlResizable` directive to be used as a drag and resize handle
 *
 * For example
 *
 * ```
 * &lt;div mwlResizable&gt;
 *   &lt;div mwlResizeHandle [resizeEdges]="{bottom: true, right: true}"&gt;&lt;/div&gt;
 * &lt;/div&gt;
 * ```
 */
export declare class ResizeHandle implements OnDestroy {
    private renderer;
    private element;
    private zone;
    /**
     * The `Edges` object that contains the edges of the parent element that dragging the handle will trigger a resize on
     */
    resizeEdges: Edges;
    /**
     * @private
     */
    resizable: Resizable;
    private eventListeners;
    constructor(renderer: Renderer2, element: ElementRef, zone: NgZone);
    ngOnDestroy(): void;
    /**
     * @private
     */
    onMousedown(event: any, mouseX: number, mouseY: number): void;
    /**
     * @private
     */
    onMouseup(mouseX: number, mouseY: number): void;
    private onMousemove(event, mouseX, mouseY);
    private unsubscribeEventListeners();
}
