export declare class CalendarDragHelper {
    private dragContainerElement;
    startPosition: ClientRect;
    constructor(dragContainerElement: HTMLElement, draggableElement: HTMLElement);
    validateDrag({x, y}: {
        x: number;
        y: number;
    }): boolean;
}
