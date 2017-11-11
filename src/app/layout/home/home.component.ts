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
            imagePath: 'assets/images/banner1.png',
            hrefUrl: 'http://terms.naver.com/entry.nhn?docId=3408936&cid=58413&categoryId=58413'
        }, {
            imagePath: 'assets/images/banner2.png',
            hrefUrl: 'https://www.google.com/intl/ko_kr/ads/'
        }, {
            imagePath: 'assets/images/slider_database.jpg',
            hrefUrl: 'https://firebase.google.com/?hl=ko'
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
