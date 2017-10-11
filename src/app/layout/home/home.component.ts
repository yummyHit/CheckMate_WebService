import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthService } from '../../shared/service/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [routerTransition()]
})
export class HomeComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];

    private companyAuth: boolean;

    constructor(private afAuth: AuthService, private router: Router) {
        this.sliders.push({
            imagePath: 'assets/images/slider_database.jpg',
            label: 'You can manage to fixture using database easily',
            text: 'CheckMate uses firebase to make real-time synchronization secure and easy to manage your data.'
        }, {
            imagePath: 'assets/images/slider_qr.jpg',
            label: 'You can manage to fixture using QR Code.',
            text: 'CheckMate can manage the fixtures more easily by taking QR Code with the Android app.'
        }, {
            imagePath: 'assets/images/slider_fixture.png',
            label: 'Very simple fixture management service!',
            text: 'Manage your fixtures more easily with the QR Code that can contain more information.'
        });

     /*    this.alerts.push({
            id: 1,
            type: 'success',
            message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
        }, {
            id: 2,
            type: 'warning',
            message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
        }); */
    }

    ngOnInit() {
	    if(!this.afAuth.getLoginAuth()) {
            alert("Authentication Failed.\nPlease Check Administrator for your Authentication.");
            this.afAuth.valueClear();
	        this.router.navigate(['/login']);
	    }
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
