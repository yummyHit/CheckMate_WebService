import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
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

    private QRKey: any[];
    private QRData: any[][];

    rows = [];
    addRows = [{ productName: '', detailedProductName: '', serialNumber: '', building: '', floor: '', roomName: '', date: '', price: '' }];
    private temp = [];
    private temp2 = [];
    expanded: any = {};
    selected = [];
    editing = {};
    addStatus: boolean;

    @ViewChild('myTable') table: any;

    constructor(private afAuth: AuthService, private router: Router) {
        this.datasClear();
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
            console.log(this.QRKey.length);
            console.log(this.QRData);
            for(let i = 0; i < this.QRKey.length; i++) {
                this.rows.push({
                    key: this.QRKey[i],
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
    }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.afAuth.updateQRDatas(this.rows[rowIndex], this.rows[rowIndex]['key']);
  }

  updateDetailValue(event, cell, index) {
    let rowIndex: number = 0;
    for(let i = 0; i < this.rows.length; i++, rowIndex++) if(this.rows[i]['key'] === index) break;
    this.editing[index + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    this.afAuth.updateQRDatas(this.rows[rowIndex], this.rows[rowIndex]['key']);
  }

  datasAdd() {
    if(!this.addStatus) this.addStatus = true;
    else {
        this.temp2.push({
            ID: this.afAuth.getUserName(),
            company: this.afAuth.getCompanyName(),
            product: (<HTMLInputElement>document.getElementById("datas.addProduct")).value,
            verbose: (<HTMLInputElement>document.getElementById("datas.addDetailed")).value,
            serial: (<HTMLInputElement>document.getElementById("datas.addSerial")).value,
            building: (<HTMLInputElement>document.getElementById("datas.addBuilding")).value,
            floor: (<HTMLInputElement>document.getElementById("datas.addFloor")).value,
            room: (<HTMLInputElement>document.getElementById("datas.addRoom")).value,
            date: (<HTMLInputElement>document.getElementById("datas.addDate")).value,
            price: (<HTMLInputElement>document.getElementById("datas.addPrice")).value
        })
        if(this.temp2[this.temp2.length - 1]['product'] === "") alert("Product name is empty!!");
        else if(this.temp2[this.temp2.length - 1]['verbose'] === "") alert("More Info is empty!!");
        else if(this.temp2[this.temp2.length - 1]['serial'] === "") alert("Serial Number is empty!!");
        else if(this.temp2[this.temp2.length - 1]['building'] === "") alert("Building name is empty!!");
        else if(this.temp2[this.temp2.length - 1]['floor'] === "") alert("Building Floor is empty!!");
        else if(this.temp2[this.temp2.length - 1]['room'] === "") alert("BUilding Room is empty!!");
        else if(this.temp2[this.temp2.length - 1]['date'] === "") alert("Date is empty!!");
        else if(this.temp2[this.temp2.length - 1]['price'] === "") alert("Price is empty!!");
        else {
            alert("Data Add Successfully!!");
            this.afAuth.updateQRDatas(this.temp2[this.temp2.length - 1], "empty");
            this.rows = this.temp2;
            this.addStatus = false;
        }
    }
  }

  datasRemove() {
    if(this.selected.length !== 0) {
      let keys: string[] = [];
      for(let i = 0; i < this.selected.length; i++) {
          keys.push(this.selected[i]['key']);
      }
      if(this.afAuth.removeQRData(keys)) {
          this.selected = [];
          for(let i = 0; i < this.QRKey.length; i++) for(let j = 0; j < keys.length; j++)
              if(this.temp2[i]['key'] === keys[j]) this.temp2[i] = [];
          this.rows = this.temp2;
      }
    } else {
      alert("Nothing was Selected!!");
    }
  }

  datasClear() {
    this.QRKey = [];
    this.QRData = [];
    this.rows = [];
    this.temp = [];
    this.temp2 = [];
    this.selected = [];
    this.addStatus = false;
  }
}
