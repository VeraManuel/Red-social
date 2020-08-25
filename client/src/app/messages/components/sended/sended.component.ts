import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FollowService } from "../../../services/follow.service";
import { UserService } from "../../../services/user.service";
import { Follow } from '../../../models/follow';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { GLOBAL } from '../../../services/global';


@Component({
    selector: 'sended',
    templateUrl: './sended.component.html',
    providers: [FollowService, UserService, MessageService]
})
export class SendedComponent implements OnInit{
    public title: string;
    public url: string;
    public follow: Follow;
    public messages: Message[];
    public identity;
    public token;
    public status: string;
    public follows;
    public pages;
    public total;
    public page;
    public next_page;
    public prev_page;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _userService: UserService,
        private _messageService: MessageService
    ){
        this.title = 'Mensajes enviados';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this
        this.url = GLOBAL.url;
    }

    ngOnInit() : void {
        this.actualPage();
    }

    actualPage(){
        this._route.params.subscribe(params => {
    
            let page = +params['page'];
            this.page = page;
        
            if(!params['page']){
                page = 1;
            }
            if(!page){
                page = 1;
            }else{
                this.next_page = page+1;
                this.prev_page = page-1;
        
                if(this.prev_page <= 0){
                this.prev_page = 1;
                }
    
                this.getMessages(this.token, this.page);    
            }
        });
    
      }


    getMessages(token, page){
        this._messageService.getEmittMessage(token, page).subscribe(
            response =>{
                if(response.messages == 'undefined'){
                    this.status = 'error';
                }else{
                    this.messages = response.messages;
                    this.total = response.total;
                    this.pages = response.pages;       
                    
                    if(page > this.pages){
                        this._router.navigate(['/mensajes/enviados',1]);
                      }
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    
}
