import { Renderer2, ElementRef, OnInit, AfterViewInit, EventEmitter, QueryList, OnDestroy, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/share';
import { ResizeHandle } from './resizeHandle.directive';
import { Edges } from './interfaces/edges.interface';
export interface ResizeCursors {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
    leftOrRight: string;
    topOrBottom: string;
}
export declare const MOUSE_MOVE_THROTTLE_MS: number;
/**
 * Place this on an element to make it resizable
 *
 * For example
 *
 * ```
 * &lt;div mwlResizable [resizeEdges]="{bottom: true, right: true, top: true, left: true}" [enableGhostResize]="true"&gt;&lt;/div&gt;
 * ```
 */
export declare class Resizable implements OnInit, OnDestroy, AfterViewInit {
    private renderer;
    elm: ElementRef;
    private zone;
    /**
     * A function that will be called before each resize event. Return `true` to allow the resize event to propagate or `false` to cancel it
     */
    validateResize: Function;
    /**
     * The edges that an element can be resized from. Pass an object like `{top: true, bottom: false}`. By default no edges can be resized.
     */
    resizeEdges: Edges;
    /**
     * Set to `true` to enable a temporary resizing effect of the element in between the `resizeStart` and `resizeEnd` events.
     */
    enableGhostResize: boolean;
    /**
     * A snap grid that resize events will be locked to.
     *
     * e.g. to only allow the element to be resized every 10px set it to `{left: 10, right: 10}`
     */
    resizeSnapGrid: Edges;
    /**
     * The mouse cursors that will be set on the resize edges
     */
    resizeCursors: ResizeCursors;
    /**
     * Mouse over thickness to active cursor.
     */
    resizeCursorPrecision: number;
    /**
     * Define the positioning of the ghost element (can be fixed or absolute)
     */
    ghostElementPositioning: 'fixed' | 'absolute';
    /**
     * Called when the mouse is pressed and a resize event is about to begin. `$event` is a `ResizeEvent` object.
     */
    resizeStart: EventEmitter<Object>;
    /**
     * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.
     */
    resizing: EventEmitter<Object>;
    /**
     * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.
     */
    resizeEnd: EventEmitter<Object>;
    /**
     * @hidden
     */
    mouseup: Subject<any>;
    /**
     * @hidden
     */
    mousedown: Subject<any>;
    /**
     * @hidden
     */
    mousemove: Subject<any>;
    /**
     * @hidden
     */
    resizeHandles: QueryList<ResizeHandle>;
    private pointerEventListeners;
    private pointerEventListenerSubscriptions;
    /**
     * @hidden
     */
    constructor(renderer: Renderer2, elm: ElementRef, zone: NgZone);
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngAfterViewInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    private setElementClass(elm, name, add);
}
