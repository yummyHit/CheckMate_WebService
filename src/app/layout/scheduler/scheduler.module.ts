import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { UtilModule } from './utils/util.module';

import { SchedulerRoutingModule } from './scheduler-routing.module';
import { SchedulerComponent } from './scheduler.component';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CalendarModule.forRoot(),
        UtilModule,
        SchedulerRoutingModule,
        PageHeaderModule
    ],
    declarations: [SchedulerComponent]
})
export class SchedulerModule { }
