import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService{

    private authState: Observable<firebase.User>
    private nowUser: firebase.User; 
    private companyName: string;
    private adminID: string;
    private userName: string;
    private idNumber: string;
    private position: string;
    private companyAuth: boolean;
    private QRkey: any[];
    private QRdata: any[][];
    private lendQRkey: any[];
    private lendQRdata: any[][];
    private lostDataKey: any[];
    private lostData: any[][];
    private selectedQR: string[];
    private schedulerData: any[];

    constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) {
        this.authState = this.afAuth.authState
        this.afAuth.authState.subscribe(user => {
            if (user) this.nowUser = user;
            else this.nowUser = null; 
        })
        this.valueClear()
    }

    // Returns true if user is logged in
    get authenticated(): boolean {
        return this.nowUser !== null;
    }
    // Returns current user data
    get currentUser(): any {
        return this.authenticated ? this.nowUser : null;
    }
    // Returns
    get currentUserObservable(): any {
        return this.nowUser
    }
    // Returns current user UID
    get currentUserId(): string {
        return this.authenticated ? this.nowUser.uid : '';
    }
    // Anonymous User
    get currentUserAnonymous(): boolean {
        return this.authenticated ? this.nowUser.isAnonymous : false
    }
    // Returns current user display name or Guest
    get currentUserDisplayName(): string {
        if (!this.nowUser) { return 'Guest' }
        else if (this.currentUserAnonymous) { return 'Anonymous' }
        else { return this.nowUser['displayName'] || 'User without a Name' }
    }

    signupAdmin(company: string, email: string, name: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then((user) => {
                this.updateUserData(
                    user,
                    company, 
                    "unused", 
                    name, 
                    "사장"
                )
            })
            .catch(error => {
		        console.log(error),
                alert("Register Failed")
	    })
    }

    signupEmail(company: string, email: string, idNo: string, name: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then((user) => {
                this.updateUserData(
                    user,
                    company, 
                    idNo, 
                    name, 
                    "사원"
                )
            })
            .catch(error => {
		        console.log(error),
                alert("Register Failed")
	    })
    }

    signupGoogle(company: string, email: string, idNo: string, name: string) {
        let userPath = `User/${email.replace(/[^0-9a-zA-Z-]/g, "")}`; // Endpoint on firebase
        let companyPath = `Company/${company}`
        let userData = {
            adminID: email.replace(/[^0-9a-zA-Z-]/g, ""),
            companyName: company,
            email: email,
            idNo: idNo,
            name: name,
            position: "사원"
        }
        this.db.object(userPath).update(userData)
            .catch(error => {
                console.log(error),
                alert("updateUserData Error")
            })
        this.db.object(companyPath).$ref.child(email.replace(/[^0-9a-zA-Z-]/g, "")).set(false)
            .catch(error => {
                console.log(error),
                alert("updateCompanyData Error")
            })
        alert("Now, your administrator must accept your account.")
        this.valueClear()
        this.router.navigate(['/login'])
    }
    
    loginEmail(email: string, password: string) {
        this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                this.nowUser = user,
                this.db.object('User/' + this.nowUser.email.replace(/[^0-9a-zA-Z-]/g, "")).take(1).subscribe(user => {
                    this.checkAuthentication(user),
                    this.companyName = user.companyName,
                    this.adminID = user.adminID,
                    this.idNumber = user.idNo,
                    this.userName = user.name,
                    this.position = user.position
                })
            })
            .catch(error => {
        	    console.log(error),
                alert("Login with Email Failed"),
                this.valueClear()
            })
    }

    loginGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()
        return this.googleSignIn(provider);
    }

    private googleSignIn(provider) {
        return this.afAuth.auth.signInWithPopup(provider)
            .then((credential) =>  {
                this.nowUser = credential.user,
                this.checkGoogleData()
            })
            .catch(error => {
		        console.log(error),
                alert("Login with Google Failed"),
                this.valueClear()
	    })
    }

    private updateUserData(user: firebase.User, companyName: string, idNumber: string, userName: string, position: string): void {
        // Writes user name and email to realtime db
        // useful if your app displays information about users or for admin features
        user.sendEmailVerification()
            .then(() => {
		let userID = user.email.replace(/[^0-9a-zA-Z-]/g, "")
                let userPath = `User/${userID}` // Endpoint on firebase
                let companyPath = `Company/${companyName}`
                let userData = {
                    adminID: userID,
                    companyName: companyName,
                    email: user.email,
                    idNo: idNumber,
                    name: userName,
                    position: position
                }
                this.db.object(userPath).update(userData)
                    .catch(error => {
                        console.log(error),
                        alert("updateUserData Error")
                    })
                this.db.object(companyPath).$ref.child(userID).set(false)
                    .catch(error => {
                        console.log(error),
                        alert("updateCompanyData Error")
                    })
		if(idNumber === "unused" && userName === "Admin") {
		    this.db.object("SemiAdmin").$ref.child(userID).set(companyName)
			.catch(error => {
			    console.log(error),
			    alert("updateAdminData Error")
		        })
		}
		user.updateProfile({
		    displayName: userName,
		    photoURL: ""
		})
		.then(() => {
		    alert("Check your email for verification")
		})
		.catch((error) => {
		    console.log(error),
		    alert("Display Name update error")
		})
            })
            .catch((error) => {
                console.log(error),
                alert("Your email address is wrong")
            })
	    this.router.navigate(['/login'])
    }

    checkAuthentication(user: any) {
        if(!this.nowUser.emailVerified) {
            alert("Your email is not verified!\nCheck your email for verification")
            this.valueClear()
        }
        else {
            this.db.object('Company/' + user.companyName).$ref.once('value', snap => {
                snap.forEach(childSnap => {
                    if(childSnap.key === user.adminID && childSnap.val() === true) return this.companyAuth = true;
                })
            })
            .then(() => {
		        this.QRDataSetting(user);
		        this.lendQRDataSetting(user);
                        this.updateLostDatas(user);
                        this.SchedulerDataSetting(user);
                this.router.navigate(['/layout'])
            })
        }
    }

    checkGoogleData() {
        this.db.object('User/' + this.nowUser.email.replace(/[^0-9a-zA-Z-]/g, "")).take(1).subscribe(user => {
            if(user.email === this.nowUser.email) {
                this.checkAuthentication(user),
                this.companyName = user.companyName,
                this.adminID = user.adminID,
                this.idNumber = user.idNo,
                this.userName = user.name,
                this.position = user.position,
		user.updateProfile({
		    displayName: user.name,
		    photoURL: ""
		})
		.then(() => {
		    alert("Check your email for verification")
		})
		.catch((error) => {
		    console.log(error),
		    alert("Display Name update error")
		})
            }
            else {
                alert("Success!! Write another information")
                this.router.navigate(['/signup'])
            }
        })
    }

    private QRDataSetting(user: any) {
        let qrPath = `QR/${user.companyName}`;
        this.db.list(qrPath, { preserveSnapshot: true }).subscribe(snapshots => {
            this.QRkey = [];
            this.QRdata = [];
            snapshots.forEach(snapshot => {
                this.QRkey.push(snapshot.key);
            })
            for(let i = 0; i < this.QRkey.length; i++) {
                this.QRdata[i] = [];
                this.db.object(qrPath + "/" + this.QRkey[i]).take(1).subscribe(data => {
                    this.QRdata[i].push(
                        data.adminID,
                        data.companyName,
                        data.productName,
                        data.detailedProductName,
                        data.serialNumber,
                        data.building,
                        data.floor,
                        data.roomName,
                        data.date,
                        data.price
                    )
                })
            }
        })
    }

    private lendQRDataSetting(user: any) {
        let qrPath = `deletedQR/${user.companyName}`;
        this.db.list(qrPath, { preserveSnapshot: true }).subscribe(snapshots => {
            this.lendQRkey = [];
            this.lendQRdata = [];
            snapshots.forEach(snapshot => {
                this.lendQRkey.push(snapshot.key);
            })
            for(let i = 0; i < this.lendQRkey.length; i++) {
                this.lendQRdata[i] = [];
                this.db.object(qrPath + "/" + this.lendQRkey[i]).take(1).subscribe(data => {
                    this.lendQRdata[i].push(
                        data.adminID,
                        data.companyName,
                        data.productName,
                        data.detailedProductName,
                        data.serialNumber,
                        data.building,
                        data.floor,
                        data.roomName,
                        data.date,
                        data.price,
                        data.lendDate
                    )
                })
            }
        })
    }

    updateQRDatas(datas: any[], key: string) {
        let qrData = {
            productName: datas['product'],
            detailedProductName: datas['verbose'],
            serialNumber: datas['serial'],
            companyName: datas['company'],
            building: datas['building'],
            floor: datas['floor'],
            roomName: datas['room'],
            date: datas['date'],
            adminID: datas['ID'],
            price: datas['price']
        }
        if(key === "empty") {
            this.db.list(`QR/${this.companyName}`).push(qrData)
        } else {
            this.db.object(`QR/${this.companyName}/${key}`).update(qrData)
                .catch(error => {
                    console.log(error),
                    alert("updateQRDatas Error")
                })
        }
    }

    lendQRData(datas: any[][], key: string[], lendDates: any[]) {
        if(confirm('Are you sure lend to selected datas?')) {
            let qrData = [];
            for(let i = 0; i < datas.length; i++) {
                qrData.push({
                    productName: datas[i]['product'],
                    detailedProductName: datas[i]['verbose'],
                    serialNumber: datas[i]['serial'],
                    companyName: datas[i]['company'],
                    building: datas[i]['building'],
                    floor: datas[i]['floor'],
                    roomName: datas[i]['room'],
                    date: datas[i]['date'],
                    adminID: datas[i]['ID'],
                    price: datas[i]['price'],
                    lendDate: lendDates[i]
                })
            }
            for(let i = 0; i < key.length; i++) {
                this.db.object(`QR/${this.companyName}`).$ref.child(key[i]).remove()
                    .catch(error => {
                        console.log(error),
                        alert("lendQRData Error")
                    })
                this.db.object(`deletedQR/${this.companyName}/${key[i]}`).update(qrData[i])
                    .catch(error => {
                        console.log(error),
                        alert("lendQRData Error")
                    })
            }
            return true;
        } else return false;
    }

    removeQRData(datas: any[][], key: string[]) {
        if(confirm('Are you sure delete selected datas?')) {
            for(let i = 0; i < key.length; i++) {
                this.db.object(`QR/${this.companyName}`).$ref.child(key[i]).remove()
                    .catch(error => {
                        console.log(error),
                        alert("removeQRData Error")
                    })
            }
            return true;
        } else return false;
    }

    removeLostData(datas: any[][], serial: string[]) {
        if(confirm('Are you sure Permit selected lost datas?')) {
            for(let i = 0; i < serial.length; i++) {
                this.db.object(`Ask/${this.companyName}`).$ref.child(serial[i]).remove()
                    .catch(error => {
                        console.log(error),
                        alert("removeLostData Error")
                    })
            }
            return true;
        } else return false;
    }

    private updateLostDatas(user: any) {
        let lostPath = `Ask/${user.companyName}`;
        this.db.list(lostPath, { preserveSnapshot: true }).subscribe(snapshots => {
            this.lostData = [];
            snapshots.forEach(snapshot => {
                this.lostDataKey.push(snapshot.key);
            })
            for(let i = 0; i < this.lostDataKey.length; i++) {
                this.lostData[i] = [];
                this.db.object(`QR/${user.companyName}/` + this.lostDataKey[i]).take(1).subscribe(data => {
                    this.lostData[i].push(
                        data.adminID,
                        data.companyName,
                        data.productName,
                        data.detailedProductName,
                        data.serialNumber,
                        data.building,
                        data.floor,
                        data.roomName,
                        data.date,
                        data.price,
                        data.lendDate
                    )
                })
            }
        })
    }

    private SchedulerDataSetting(user: any) {
        let schedulerPath = `Calendar/${user.companyName}`;
        this.db.list(schedulerPath, { preserveSnapshot: true }).subscribe(snapshots => {
            this.schedulerData = [];
            snapshots.forEach(snapshot => {
                this.schedulerData.push({date: snapshot.key, content: snapshot.val()});
            })
        })
    }

    updateSchedulerData(content: any, date: any) {
        let putDate;
        if((new Date(date).getUTCDate() + 1) < 10) putDate = "" + (new Date(date).getUTCFullYear()) + "-" + (new Date(date).getUTCMonth() + 1) + "-0" + (new Date(date).getUTCDate() + 1);
        else putDate = "" + (new Date(date).getUTCFullYear()) + "-" + (new Date(date).getUTCMonth() + 1) + "-" + (new Date(date).getUTCDate() + 1);
        this.db.object(`Calendar/${this.companyName}/`).$ref.child(putDate).set(content)
            .catch(error => {
                console.log(error),
                alert("updateSchedulerDatas Error")
            })
    }

    removeSchedulerData(date: any) {
        let putDate;
        if((new Date(date).getUTCDate() + 1) < 10) putDate = "" + (new Date(date).getUTCFullYear()) + "-" + (new Date(date).getUTCMonth() + 1) + "-0" + (new Date(date).getUTCDate() + 1);
        else putDate = "" + (new Date(date).getUTCFullYear()) + "-" + (new Date(date).getUTCMonth() + 1) + "-" + (new Date(date).getUTCDate() + 1);
        this.db.object(`Calendar/${this.companyName}/`).$ref.child(putDate).remove()
            .catch(error => {
                console.log(error),
                alert("removeSchedulerData Error")
            })
    }

    logout(): void {
        this.afAuth.auth.signOut()
            .catch(error => {
                console.log(error)
            })
        this.valueClear()
    }

    resetPassword(email: string) {
        var auth = firebase.auth()
        return auth.sendPasswordResetEmail(email)
            .then(() => console.log("email sent"))
            .catch((error) => console.log(error))
    }

    setSelectedQR(qrData: string, index: number) {
        if(index === 0) this.selectedQR = [];
        this.selectedQR.push(qrData);
    }

    setSchedulerData(date: string, content: string) {
       
    }

    valueClear() {
        this.nowUser = null;
        this.companyName = null;
        this.adminID = null;
        this.idNumber = null;
        this.userName = null;
        this.position = null;
        this.companyAuth = false;
        this.QRkey = [];
        this.QRdata = [];
        this.lendQRkey = [];
        this.lendQRdata = [];
        this.lostDataKey = [];
        this.lostData = [];
        this.schedulerData = [];
    }

    getNowUserEmail() {
        if(this.nowUser != null) return this.nowUser.email;
        else return null;
    }

    getUserName() {
        return this.userName;
    }

    getCompanyName() {
        return this.companyName;
    }

    getAuthState() {
        return this.authState;
    }

    getLoginAuth() {
    	return this.companyAuth;
    }

    getQRKey() {
        return this.QRkey;
    }

    getQRData() {
        return this.QRdata;
    }

    getLendQRKey() {
        return this.lendQRkey;
    }

    getLendQRData() {
        return this.lendQRdata;
    }

    getLostData() {
        return this.lostData;
    }

    getSelectedQR() {
        return this.selectedQR;
    }

    getSchedulerDatas() {
        return this.schedulerData;
    }
}
