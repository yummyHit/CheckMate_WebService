import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { LostChkRoutingModule } from './lost-chk-routing.module';
import { LostChkComponent } from './lost-chk.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgxDatatableModule,
        LostChkRoutingModule,
        PageHeaderModule
    ],
    declarations: [LostChkComponent]
})
export class LostChkModule { }
