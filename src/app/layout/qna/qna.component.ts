import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthService } from '../../shared/service/auth.service';

@Component({
    selector: 'app-qna',
    templateUrl: './qna.component.html',
    styleUrls: ['./qna.component.scss'],
    animations: [routerTransition()]
})
export class QnAComponent implements OnInit {
    constructor(private afAuth: AuthService, private router: Router) {
    }

    ngOnInit() {
	    if(!this.afAuth.getLoginAuth()) {
            alert("Authentication Failed.\nPlease Check Administrator for your Authentication.");
            this.afAuth.valueClear();
	        this.router.navigate(['/login']);
	    }
    }
}
