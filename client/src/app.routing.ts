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

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component:HomeComponent},
    {path: 'login', component:LoginComponent},
    {path: 'registro', component:RegisterComponent},
    {path: 'mis-datos', component:UserEditComponent},
    {path: 'gente', component:UsersComponent},
    {path: 'gente/:page', component:UsersComponent},
    {path: 'timeline', component:TimelineComponent},
    {path:'perfil/:id', component:ProfileComponent},
    {path:'siguiendo/:id/:page', component:FollowingComponent},
    {path:'seguidores/:id/:page', component:FollowedComponent},
    {path: '**', component:HomeComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);

