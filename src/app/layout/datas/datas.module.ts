import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DatasRoutingModule } from './datas-routing.module';
import { DatasComponent } from './datas.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        Ng2Charts,
        NgxDatatableModule,
        DatasRoutingModule,
        PageHeaderModule
    ],
    declarations: [DatasComponent]
})
export class DatasModule { }
