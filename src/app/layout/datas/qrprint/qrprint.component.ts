import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../../router.animations';
import { AuthService } from '../../../shared/service/auth.service';

@Component({
  selector: 'app-qrprint',
  templateUrl: './qrprint.component.html',
  styleUrls: ['./qrprint.component.scss'],
  animations: [routerTransition()]
})
export class QrprintComponent implements OnInit {

    selectedQRs: string[] = [];
    selectedQRType: 'url' | 'canvas' | 'img' = 'url';
    private chkCount: number = 0;
    qrStatus_0 = false;
    qrStatus_1 = false;
    qrStatus_2 = false;
    qrStatus_3 = false;
    qrStatus_4 = false;
    qrStatus_5 = false;
    qrStatus_6 = false;
    qrStatus_7 = false;
    qrStatus_8 = false;
    qrStatus_9 = false;
    qrStatus_10 = false;
    qrStatus_11 = false;
    qrStatus_12 = false;
    qrStatus_13 = false;
    qrStatus_14 = false;
    qrStatus_15 = false;
    qrStatus_16 = false;
    qrStatus_17 = false;
    qrStatus_18 = false;
    qrStatus_19 = false;
    qrStatus_20 = false;
    qrStatus_21 = false;
    qrStatus_22 = false;
    qrStatus_23 = false;
    qrStatus_24 = false;
    qrStatus_25 = false;
    qrStatus_26 = false;
    qrStatus_27 = false;
    qrStatus_28 = false;
    qrStatus_29 = false;

  constructor(private afAuth: AuthService, private router: Router) { 
      this.selectedQRs = this.afAuth.getSelectedQR();
  }

  ngOnInit() {
  }

    qrPrint() {
        this.selectedQRs = [];
        this.statusClear();
        this.selectedQRs = this.afAuth.getSelectedQR();
        if(this.selectedQRs.length > 0) this.qrStatus_0 = true;
        if(this.selectedQRs.length > 1) this.qrStatus_1 = true;
        if(this.selectedQRs.length > 2) this.qrStatus_2 = true;
        if(this.selectedQRs.length > 3) this.qrStatus_3 = true;
        if(this.selectedQRs.length > 4) this.qrStatus_4 = true;
        if(this.selectedQRs.length > 5) this.qrStatus_5 = true;
        if(this.selectedQRs.length > 6) this.qrStatus_6 = true;
        if(this.selectedQRs.length > 7) this.qrStatus_7 = true;
        if(this.selectedQRs.length > 8) this.qrStatus_8 = true;
        if(this.selectedQRs.length > 9) this.qrStatus_9 = true;
        if(this.selectedQRs.length > 10) this.qrStatus_10 = true;
        if(this.selectedQRs.length > 11) this.qrStatus_11 = true;
        if(this.selectedQRs.length > 12) this.qrStatus_12 = true;
        if(this.selectedQRs.length > 13) this.qrStatus_13 = true;
        if(this.selectedQRs.length > 14) this.qrStatus_14 = true;
        if(this.selectedQRs.length > 15) this.qrStatus_15 = true;
        if(this.selectedQRs.length > 16) this.qrStatus_16 = true;
        if(this.selectedQRs.length > 17) this.qrStatus_17 = true;
        if(this.selectedQRs.length > 18) this.qrStatus_18 = true;
        if(this.selectedQRs.length > 19) this.qrStatus_19 = true;
        if(this.selectedQRs.length > 20) this.qrStatus_20 = true;
        if(this.selectedQRs.length > 21) this.qrStatus_21 = true;
        if(this.selectedQRs.length > 22) this.qrStatus_22 = true;
        if(this.selectedQRs.length > 23) this.qrStatus_23 = true;
        if(this.selectedQRs.length > 24) this.qrStatus_24 = true;
        if(this.selectedQRs.length > 25) this.qrStatus_25 = true;
        if(this.selectedQRs.length > 26) this.qrStatus_26 = true;
        if(this.selectedQRs.length > 27) this.qrStatus_27 = true;
        if(this.selectedQRs.length > 28) this.qrStatus_28 = true;
        if(this.selectedQRs.length > 29) this.qrStatus_29 = true;
        if(this.chkCount === 0) { alert("Please one more click this button"); this.chkCount++; }
        else this.printPage();
    }

    private printPage() {
        let popupWin, printContent;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        printContent = document.getElementById('qrprint.print').innerHTML;
        console.log(printContent);
        popupWin.document.write(`
            <html>
                <head>
                    <title>Print tab</title>
                </head>
                <body onload="window.print();window.close()">${printContent}
                </body>
            </html>
        `);
        popupWin.document.close();
        this.chkCount = 0;
    }

    statusClear() {
        this.qrStatus_0 = this.qrStatus_1 = this.qrStatus_2 = this.qrStatus_3 = this.qrStatus_4 = this.qrStatus_5 = this.qrStatus_6 = this.qrStatus_7 = this.qrStatus_8 = this.qrStatus_9 = this.qrStatus_10 = this.qrStatus_11 = this.qrStatus_12 = this.qrStatus_13 = this.qrStatus_14 = this.qrStatus_15 = this.qrStatus_16 = this.qrStatus_17 = this.qrStatus_18 = this.qrStatus_19 = this.qrStatus_20 = this.qrStatus_21 = this.qrStatus_22 = this.qrStatus_23 = this.qrStatus_24 = this.qrStatus_25 = this.qrStatus_26 = this.qrStatus_27 = this.qrStatus_28 = this.qrStatus_29 = false;
    }
}
