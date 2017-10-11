import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulerRoutingModule } from './scheduler-routing.module';
import { SchedulerComponent } from './scheduler.component';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [
        CommonModule,
        SchedulerRoutingModule,
        PageHeaderModule
    ],
    declarations: [SchedulerComponent]
})
export class SchedulerModule { }
