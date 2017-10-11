import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QnAComponent } from './qna.component';
import { QnARoutingModule } from './qna-routing.module';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [
        CommonModule,
        QnARoutingModule,
        PageHeaderModule
    ],
    declarations: [QnAComponent]
})
export class QnAModule { }
