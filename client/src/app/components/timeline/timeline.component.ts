import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Route } from '@angular/router';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { PublicationService } from '../../services/publication.service';
import * as $ from 'jquery'; 

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public page;
  public publications: Publication[];
  public total;
  public pages;
  public itemsPerPage;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) {
      this.title = "Timeline"
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.page = 1;
   }

  ngOnInit(): void {
    this.getPublications(this.page);
  }

  getPublications(page, adding = false){
    this._publicationService.getPublications(this.token, this.page).subscribe(
      response => {
        if(response.publications){
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

          if(!adding){
            this.publications = response.publications;
          }else{
            var arrayA = this.publications;
            var arrayB = response.publications;

            this.publications = arrayA.concat(arrayB);
            $("html, body").animate({scrollTop: $('body').prop("scrollHeight")},500);
          }

          if(page > this.pages){
            
          }
        }else{
          this.status = 'error';
        }
      },
      error =>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = 'error';
        }
      }
    );
  }

  public noMore =false;
  viewMore(){
    if(this.publications.length == this.total){
      this.noMore = true;
    }else{
      this.page += 1;
    }

    this.getPublications(this.page, true);
  }

  refresh(event){
    this.getPublications(1);
  }

}
