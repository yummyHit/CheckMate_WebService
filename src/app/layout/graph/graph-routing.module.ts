import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GraphComponent } from './graph.component';

const routes: Routes = [
    {
         path: '', component: GraphComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GraphRoutingModule { }
