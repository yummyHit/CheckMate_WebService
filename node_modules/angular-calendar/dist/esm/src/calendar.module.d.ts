import { ModuleWithProviders, Provider } from '@angular/core';
export interface CalendarModuleConfig {
    eventTitleFormatter?: Provider;
    dateFormatter?: Provider;
    utils?: Provider;
}
/**
 * The main module of this library. Example usage:
 *
 * ```typescript
 * import { CalenderModule } from 'angular-calendar';
 *
 * &commat;NgModule({
 *   imports: [
 *     CalenderModule.forRoot()
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
export declare class CalendarModule {
    static forRoot(config?: CalendarModuleConfig): ModuleWithProviders;
}
