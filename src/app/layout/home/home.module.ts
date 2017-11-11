import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NgbCarouselModule,
    NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';


import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {
    ChatComponent
} from './components';
import { StatModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        HomeRoutingModule,
        StatModule,
    ],
    declarations: [
        HomeComponent,
        ChatComponent
    ]
})
export class HomeModule { }
