import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { HotTableModule } from 'angular-handsontable';

import { DatasRoutingModule } from './datas-routing.module';
import { DatasComponent } from './datas.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        Ng2Charts,
        HotTableModule,
        DatasRoutingModule,
        PageHeaderModule
    ],
    declarations: [DatasComponent]
})
export class DatasModule { }
