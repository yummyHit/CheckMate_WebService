import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/service/auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    private email: string;
    private password: string;
    showSpinner: boolean = false;
    private loads: Observable<any>;
    
    constructor(private afAuth: AuthService, private router: Router) {
        this.showSpinner = false;
    }

    ngOnInit() {
        this.loginClear();
        this.afAuth.valueClear();
    }

    loginGoogle() {
        this.afAuth.loginGoogle();
    }

    loginEmail() {
        this.showSpinner = true;
	    this.email = (<HTMLInputElement>document.getElementById("login.email")).value;
	    this.password = (<HTMLInputElement>document.getElementById("login.password")).value;
        this.afAuth.loginEmail(this.email, this.password);
        this.loginClear();
        (<HTMLInputElement>document.getElementById("login.email")).value = null;
	    (<HTMLInputElement>document.getElementById("login.password")).value = null;
        Observable.interval(5000).take(1).subscribe(() => this.showSpinner = false)
    }

    loginClear() {
	    this.email = null;
	    this.password = null;
    }
}
