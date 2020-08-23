import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService],
})
export class ProfileComponent implements OnInit {
  public title:string;
  public user: User;
  public follow: Follow;
  public status:string;
  public token;
  public identity;
  public url:String;
  public stats;
  public followed: boolean;
  public following: boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = "Perfil";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.followed = false;
    this.following = false;

   }

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(){
    this._route.params.subscribe(params => {
      let id = params['id'];

      this.getUser(id);
      this.getCounters(id);
    });
  }

  getUser(id){
    this._userService.getUser(id).subscribe(
      response => {
        if(response.user != 'undefined'){

          this.user = response.user;

          if(response.followed != null){
            this.followed = true;
          }else{
            this.followed = false;;
          }

          if(response.following != null){
            this.following = true;
          }else{
            this.following = false;
          }

        }else{
          this.status = 'error';
          console.log(response);
        }
      },
      error => {
        console.log(<any>error);
        this._router.navigate(['/perfil/', this.identity._id]);
      }
    );
  }

  getCounters(id){
    this._userService.getCounters(id).subscribe(
      response => {
        this.stats = response;

      },
      error => {
        console.log(<any>error);
      }
    );
  }

  followUser(followed){
    var follow = new Follow('',this.identity,followed);


    this._followService.addFollow(this.token,follow).subscribe(
      response => {
        this.following = true;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  unfollowUser(followed){
    this._followService.deleteFollow(this.token, followed).subscribe(
      response => {
        this.following = false;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  public followUserOver;
  mouseEnter(user_id){
    this.followUserOver = user_id;
  }
  mouseLeave(){
    this.followUserOver = 0;
  }

}
