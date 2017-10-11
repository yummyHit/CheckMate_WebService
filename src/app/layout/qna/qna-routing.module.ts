import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QnAComponent } from './qna.component';

const routes: Routes = [
    { path: '', component: QnAComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QnARoutingModule { }
