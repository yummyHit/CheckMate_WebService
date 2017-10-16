import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthService } from '../../shared/service/auth.service';

@Component({
    selector: 'app-datas',
    templateUrl: './datas.component.html',
    styleUrls: ['./datas.component.scss'],
    animations: [routerTransition()]
})
export class DatasComponent implements OnInit {

    private QRKey: any[] = [];
    private QRData: any[][] = [];

    rows = [];
    private temp = [];
    private temp2;
    private table = { offset : 0, };

    constructor(private afAuth: AuthService, private router: Router) {
    }

    ngOnInit() {
	    if(!this.afAuth.getLoginAuth()) {
            alert("Authentication Failed.\nPlease Check Administrator for your Authentication.");
            this.afAuth.valueClear();
	        this.router.navigate(['/login']);
	    }
        else {
            this.QRKey = this.afAuth.getQRKey();
            this.QRData = this.afAuth.getQRData();
            for(let i = 0; i < this.QRKey.length; i++) {
                this.rows.push({
                    ID: this.QRData[i][0],
                    company: this.QRData[i][1],
                    product: this.QRData[i][2],
                    verbose: this.QRData[i][3],
                    serial: this.QRData[i][4],
                    building: this.QRData[i][5],
                    floor: this.QRData[i][6],
                    room: this.QRData[i][7],
                    date: this.QRData[i][8],
                    price: this.QRData[i][9]
                })
            }
            this.temp2 = this.rows;
        }
    }

    updateFilter(event) {
        const val = event.target.value.toLowerCase();
    
        this.rows = [...this.temp2];
        this.temp = [...this.rows];
        const tmp = this.temp.filter(function(data) {
            return (data.product.toLowerCase().indexOf(val) !== -1) || (data.serial.toLowerCase().indexOf(val) !== -1) ||
                   (data.building.toLowerCase().indexOf(val) !== -1) || !val;
        });
    
        this.rows = tmp;
        this.table.offset = 0;
    }
}
