import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  animations: [routerTransition()]
})
export class GraphComponent implements OnInit {

    private QRKey: any[] = [];
    private QRData: any[][] = [];
    private lendQRKey: any[] = [];
    private lendQRData: any[][] = [];
    private nowDate: string[] = [];
    private dailyAddCnt: number[] = [0, 0, 0, 0, 0, 0, 0];
    private dailyLendCnt: number[] = [0, 0, 0, 0, 0, 0, 0];
    private monthlyAddCnt: number = 0;
    private monthlyLendCnt: number = 0;

    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = [];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [
        { data: [this.dailyAddCnt[0], this.dailyAddCnt[1], this.dailyAddCnt[2], this.dailyAddCnt[3], this.dailyAddCnt[4], this.dailyAddCnt[5], this.dailyAddCnt[6]], label: '입고' },
        { data: [this.dailyLendCnt[0], this.dailyLendCnt[1], this.dailyLendCnt[2], this.dailyLendCnt[3], this.dailyLendCnt[4], this.dailyLendCnt[5], this.dailyLendCnt[6]], label: '출고' }
    ];
    // Doughnut
    public doughnutChartLabels: string[] = ['입고', '출고'];
    public doughnutChartData: number[] = [this.monthlyAddCnt, this.monthlyLendCnt];
    public doughnutChartType: string = 'doughnut';

  constructor(private afAuth: AuthService, private router: Router) { }

  ngOnInit() {
        if(!this.afAuth.getLoginAuth()) {
            alert("Authentication Failed.\nPlease Check Administrator for your Authentication.");
            this.afAuth.valueClear();
	        this.router.navigate(['/login']);
	    }
        else {
            this.QRKey = this.afAuth.getQRKey();
            this.QRData = this.afAuth.getQRData();
            this.lendQRKey = this.afAuth.getLendQRKey();
            this.lendQRData = this.afAuth.getLendQRData();
            for(let i = 6; i >= 0; i--) {
                if((new Date(Date.now() - i * 24 * 60 * 60 * 1000).getUTCDate()) < 10) this.nowDate.push("" + (new Date(Date.now() - i * 24 * 60 * 60 * 1000).getUTCFullYear()) + "-" + (new Date(Date.now() - i * 24 * 60 * 60 * 1000).getUTCMonth() + 1) + "-0" + (new Date(Date.now() - i * 24 * 60 * 60 * 1000).getUTCDate()));
                else this.nowDate.push("" + (new Date(Date.now() - i * 24 * 60 * 60 * 1000).getUTCFullYear()) + "-" + (new Date(Date.now() - i * 24 * 60 * 60 * 1000).getUTCMonth() + 1) + "-" + (new Date(Date.now() - i * 24 * 60 * 60 * 1000).getUTCDate()));
            }
            for(let i = 0; i < 7; i++) this.barChartLabels.push(this.nowDate[i]);
            for(let i = 0; i < this.QRKey.length; i++) {
                for(let j = 0; j < 7; j++) if(this.nowDate[j].localeCompare(this.QRData[i][8]) === 0) this.dailyAddCnt[j]++;
                if((new Date(this.QRData[i][8]).getUTCMonth() + 1) === (new Date().getUTCMonth() + 1)) this.monthlyAddCnt++;
            }
            for(let i = 0; i < this.lendQRKey.length; i++) {
                for(let j = 0; j < 7; j++) {
                    if(this.nowDate[j].localeCompare(this.lendQRData[i][8]) === 0) this.dailyAddCnt[j]++;
                    if(this.nowDate[j].localeCompare(this.lendQRData[i][10]) === 0) this.dailyLendCnt[j]++;
                }
                if((new Date(this.lendQRData[i][8]).getUTCMonth() + 1) === (new Date().getUTCMonth() + 1)) this.monthlyAddCnt++;
                if((new Date(this.lendQRData[i][10]).getUTCMonth() + 1) === (new Date().getUTCMonth() + 1)) this.monthlyLendCnt++;
            }
            this.barChartData[0]['data'] = this.dailyAddCnt;
            this.barChartData[1]['data'] = this.dailyLendCnt;
            this.doughnutChartData = [this.monthlyAddCnt, this.monthlyLendCnt];
        }
  }
}
