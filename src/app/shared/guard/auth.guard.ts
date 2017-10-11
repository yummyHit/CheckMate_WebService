import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuard implements CanActivate {

    private authState: any = null;

    constructor(private auth: AuthService, private router: Router) {
        this.auth.getAuthState().subscribe((auth) => {
            this.authState = auth;
        });
    }

    canActivate(): Observable<boolean> {
        return Observable.from(this.authState)
        .take(1)
        .map(state => !!state)
        .do(authenticated => {
        if (!authenticated) this.router.navigate([ '/login' ]);
      })
    }
}
