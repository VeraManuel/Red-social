import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PublicationService]
})
export class SidebarComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public url: string;
  public status;
  public publication: Publication

  constructor(
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _route: ActivatedRoute,
    private _router: Router
    ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
    this.publication = new Publication("","","","",this.identity._id);
   }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response => {
        if(response.publication){
          this.status = 'success';
          form.reset();
          this._router.navigate(['/timeline']);

        }else{
          this.status = 'error';
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = 'error';
        }
      }
    );
  }

  @Output() sended = new EventEmitter();
  sendPublication(event){
    this.sended.emit({send: 'true'});
  }

}
