import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'datas', loadChildren: './datas/datas.module#DatasModule' },
            { path: 'qna', loadChildren: './qna/qna.module#QnAModule' },
            { path: 'scheduler', loadChildren: './scheduler/scheduler.module#SchedulerModule' },
            { path: 'about', loadChildren: './about/about.module#AboutModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
