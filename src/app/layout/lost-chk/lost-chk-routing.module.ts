import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LostChkComponent } from './lost-chk.component';

const routes: Routes = [
    {
         path: '', component: LostChkComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LostChkRoutingModule { }
