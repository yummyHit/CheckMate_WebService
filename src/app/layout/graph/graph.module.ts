import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsModule as Ng2Charts } from 'ng2-charts';
import { GraphRoutingModule } from './graph-routing.module';
import { GraphComponent } from './graph.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        Ng2Charts,
        GraphRoutingModule,
        PageHeaderModule
    ],
    declarations: [
        GraphComponent
    ]
})
export class GraphModule { }
