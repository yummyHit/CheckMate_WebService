import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatasComponent } from './datas.component';

const routes: Routes = [
    { path: '', component: DatasComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DatasRoutingModule { }
