import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AuthService } from './shared';

const routes: Routes = [
    {
        path: '',
	loadChildren: './login/login.module#LoginModule',
    },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: 'layout', loadChildren: './layout/layout.module#LayoutModule' },
    { path: 'signup', loadChildren: './signup/signup.module#SignupModule' },
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
