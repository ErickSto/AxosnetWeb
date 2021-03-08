import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RecibosComponent } from './pages/recibos/recibos.component';

const APP_ROUTES: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'recibos', component: RecibosComponent},
    {path: '**', pathMatch: 'full', redirectTo: 'login'}
]

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash : true});