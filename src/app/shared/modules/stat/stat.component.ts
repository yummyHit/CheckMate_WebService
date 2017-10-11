import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
    selector: 'app-stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
    @Input() bgClass: string;
    @Input() icon: string;
    @Input() count: number;
    @Input() label: string;
    @Input() data: number;
    @Output() event: EventEmitter<any> = new EventEmitter();

    constructor(private afAuth: AuthService, private router: Router) { }

    ngOnInit() {}

    goComponent() {
        if(this.label === "Data Management") this.router.navigate(['/layout/datas']);
        else if(this.label === "Scheduler") this.router.navigate(['/layout/scheduler']);
        else if(this.label === "Q&A") this.router.navigate(['/layout/qna']);
        else this.router.navigate(['/layout']);
    }
}
