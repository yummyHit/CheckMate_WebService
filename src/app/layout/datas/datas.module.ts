import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { DatasRoutingModule } from './datas-routing.module';
import { DatasComponent } from './datas.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgxDatatableModule,
        NgxQRCodeModule,
        DatasRoutingModule,
        PageHeaderModule
    ],
    declarations: [DatasComponent]
})
export class DatasModule { }
