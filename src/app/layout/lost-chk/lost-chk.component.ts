import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-lost-chk',
  templateUrl: './lost-chk.component.html',
  styleUrls: ['./lost-chk.component.scss'],
  animations: [routerTransition()]
})
export class LostChkComponent implements OnInit {

    private carryKey: any[];
    private carryData: any[][];
    private lostData: any[][];

    lostRows = [];
    carryRows = [];

    lostSelected = [];
    carrySelected = [];
    @ViewChild('myTable') table: any;

  onLostSelect({ lostSelected }) {
    this.lostSelected.splice(0, this.lostSelected.length);
    this.lostSelected.push(...lostSelected);
  }

  onCarrySelect({ carrySelected }) {
    this.carrySelected.splice(0, this.carrySelected.length);
    this.carrySelected.push(...carrySelected);
  }

  constructor(private afAuth: AuthService, private router: Router) { }

  ngOnInit() {
        if(!this.afAuth.getLoginAuth()) {
            alert("Authentication Failed.\nPlease Check Administrator for your Authentication.");
            this.afAuth.valueClear();
	        this.router.navigate(['/login']);
	}
        else {
            this.lostClear();
            this.carryKey = this.afAuth.getLendQRKey();
            this.carryData = this.afAuth.getLendQRData();
            this.lostData = this.afAuth.getLostData();
            for(let i = 0; i < this.carryKey.length; i++) {
                this.carryRows.push({
                    index: i,
                    key: this.carryKey[i],
                    product: this.carryData[i][2],
                    serial: this.carryData[i][4],
                    building: this.carryData[i][5],
                    lendDate: this.carryData[i][10]
                })
            }
            for(let i = 0; i < this.lostData.length; i++) {
                this.lostRows.push({
                    index: i,
                    product: this.lostData[i][2],
                    serial: this.lostData[i][4],
                    building: this.lostData[i][5],
                })
            }
        }
  }

  lostCheck() {
    if(this.lostSelected.length !== 0) {
      let keys: string[] = [];
      for(let i = 0; i < this.lostSelected.length; i++) keys.push(this.lostSelected[i]['serial']);
      if(this.afAuth.removeLostData(this.lostSelected, keys)) {
          for(let i = 0, k = 0; i < this.lostRows.length; i++) for(let j = 0; j < keys.length; j++)
              if(this.lostRows[i]['serial'] === keys[j]) {
                  this.lostSelected.splice(k++, 1);
                  this.lostRows.splice(i--, 1);
              }
          this.lostSelected = [];
        }
      } else {
        alert("Nothing was Selected!!");
      }
  }

  lostCarry() {
  }

  lostClear() {
    this.carryKey = [];
    this.carryData = [];
    this.lostRows = [];
    this.carryRows = [];
  }
}
