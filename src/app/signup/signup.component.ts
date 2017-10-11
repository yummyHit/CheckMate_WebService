import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/service/auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})

export class SignupComponent implements OnInit {
    
    private authState: any = null;
    
    companyList = [{name: "삼성"}, {name: "현대"}, {name: "LG"}, {name: "Add Company"}];
    private companyName: string;
    private email: string;
    private idNumber: string;
    private name: string;
    private password: string;
    private chkpassword: string;
    private companyNode: any;
    private nameNode: any;
    
    constructor(private afAuth: AuthService, private router: Router) { }
    
    ngOnInit() {
        this.signupClear();
        this.afAuth.getAuthState().subscribe((auth) => {
            this.authState = auth;
        });
        (<HTMLInputElement>document.getElementById("signup.email")).setAttribute("type", "text");
        (<HTMLInputElement>document.getElementById("signup.password")).setAttribute("type", "password");
        (<HTMLInputElement>document.getElementById("signup.chkpassword")).setAttribute("type", "password");
        if((this.email = this.afAuth.getNowUserEmail()) != null) {
            (<HTMLInputElement>document.getElementById("signup.email")).setAttribute("type", "hidden");
            (<HTMLInputElement>document.getElementById("signup.password")).setAttribute("type", "hidden");
            (<HTMLInputElement>document.getElementById("signup.chkpassword")).setAttribute("type", "hidden");
        }
    }
    
    changeCompany(event) {
        this.companyNode = document.getElementById("signup.company");
	this.nameNode = document.getElementById("signup.name");
	    (<HTMLInputElement>this.companyNode).value = null;
        if(event.target.value === "Add Company") {
            this.companyName = null;
            if(this.companyNode.hasAttribute("value")) this.companyNode.removeAttribute("value");
            this.companyNode.setAttribute("placeholder", "Write Your Company...");
            if(this.companyNode.hasAttribute("readonly")) this.companyNode.removeAttribute("readonly");
            (<HTMLInputElement>document.getElementById("signup.idNumber")).setAttribute("type", "hidden");
            this.nameNode.value = "Admin";
            this.nameNode.setAttribute("readonly", "readonly");
        } else {
            this.companyName = event.target.value;
	        if(this.companyNode.hasAttribute("placeholder")) this.companyNode.removeAttribute("placeholder");
            (<HTMLInputElement>this.companyNode).value = this.companyName;
            this.companyNode.setAttribute("readonly", "readonly");
            (<HTMLInputElement>document.getElementById("signup.idNumber")).setAttribute("type", "text");
            this.nameNode.setAttribute("type", "text");
            this.nameNode.value = null;
            this.nameNode.removeAttribute("value");
            this.nameNode.removeAttribute("readonly");
        }
    }
    
    signupEmail() {
        if(this.companyName === null && (this.name = (<HTMLInputElement>document.getElementById("signup.name")).value)=== "Admin") {
            this.companyName = (<HTMLInputElement>document.getElementById("signup.company")).value;
            this.email = (<HTMLInputElement>document.getElementById("signup.email")).value;
            this.password = (<HTMLInputElement>document.getElementById("signup.password")).value;
            this.chkpassword = (<HTMLInputElement>document.getElementById("signup.chkpassword")).value;
            if(this.password === this.chkpassword) this.afAuth.signupAdmin(this.companyName, this.email, this.name, this.password);
            else alert("Password incorrect!! try again.");
	}
        else if(this.email !== null) {
            this.idNumber = (<HTMLInputElement>document.getElementById("signup.idNumber")).value;
            this.name = (<HTMLInputElement>document.getElementById("signup.name")).value;
            this.afAuth.signupGoogle(this.companyName, this.email, this.idNumber, this.name);
        }
        else if(this.email === null) {
            this.email = (<HTMLInputElement>document.getElementById("signup.email")).value;
            this.idNumber = (<HTMLInputElement>document.getElementById("signup.idNumber")).value;
            this.name = (<HTMLInputElement>document.getElementById("signup.name")).value;
            this.password = (<HTMLInputElement>document.getElementById("signup.password")).value;
            this.chkpassword = (<HTMLInputElement>document.getElementById("signup.chkpassword")).value;
            if(this.password === this.chkpassword) this.afAuth.signupEmail(this.companyName, this.email, this.idNumber, this.name, this.password);
            else alert("Password incorrect!! try again.");
        }
        this.signupClear();
    }

    signupClear() {
	    this.companyName = null;
	    this.email = null;
	    this.idNumber = null;
	    this.name = null;
	    this.password = null;
	    this.chkpassword = null;
	    this.companyNode = null;
            this.nameNode = null;
    }

    signupBackBtn() {
        this.signupClear();
        this.afAuth.valueClear();
	this.router.navigate(['/login']);
    }
}
