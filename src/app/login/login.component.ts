import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/service/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    private email: string;
    private password: string;
    
    constructor(private afAuth: AuthService, private router: Router) {
    }

    ngOnInit() {
        this.loginClear();
        this.afAuth.valueClear();
    }

    loginGoogle() {
        this.afAuth.loginGoogle();
    }

    loginEmail() {
	    this.email = (<HTMLInputElement>document.getElementById("login.email")).value;
	    this.password = (<HTMLInputElement>document.getElementById("login.password")).value;
        this.afAuth.loginEmail(this.email, this.password);
        this.loginClear();
    }

    loginClear() {
	    this.email = null;
	    this.password = null;
        (<HTMLInputElement>document.getElementById("login.email")).value = null;
	    (<HTMLInputElement>document.getElementById("login.password")).value = null;
    }
}
