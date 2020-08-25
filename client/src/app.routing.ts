import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule} from "@angular/router";

import { LoginComponent } from './app/components/login/login.component';
import { RegisterComponent } from './app/components/register/register.component';
import { HomeComponent } from './app/components/home/home.component';
import { UserEditComponent } from './app/components/user-edit/user-edit.component';
import { UsersComponent } from './app/components/users/users.component';
import { TimelineComponent } from './app/components/timeline/timeline.component';
import { ProfileComponent } from './app/components/profile/profile.component';
import { FollowingComponent } from './app/components/following/following.component';
import { FollowedComponent } from './app/components/followed/followed.component';
import { UserGuard } from './app/services/user.guard';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component:HomeComponent},
    {path: 'login', component:LoginComponent},
    {path: 'registro', component:RegisterComponent},
    {path: 'mis-datos', component:UserEditComponent, canActivate:[UserGuard]},
    {path: 'gente', component:UsersComponent, canActivate:[UserGuard]},
    {path: 'gente/:page', component:UsersComponent, canActivate:[UserGuard]},
    {path: 'timeline', component:TimelineComponent, canActivate:[UserGuard]},
    {path:'perfil/:id', component:ProfileComponent, canActivate:[UserGuard]},
    {path:'siguiendo/:id/:page', component:FollowingComponent, canActivate:[UserGuard]},
    {path:'seguidores/:id/:page', component:FollowedComponent, canActivate:[UserGuard]},
    {path: '**', component:HomeComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);

