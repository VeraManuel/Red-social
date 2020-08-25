import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { FollowService } from "../../../services/follow.service";
import { UserService } from "../../../services/user.service";
import { Follow } from '../../../models/follow';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { GLOBAL } from '../../../services/global';

@Component({
    selector: 'add',
    templateUrl: './add.component.html',
    providers: [FollowService, UserService, MessageService]
})
export class AddComponent implements OnInit{
    public title: string;
    public url: string;
    public follow: Follow;
    public message: Message;
    public identity;
    public token;
    public status: string;
    public follows;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _userService: UserService,
        private _messageService: MessageService

    ){
        this.title = 'Enviar mensaje';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.message = new Message ('','','','',this.identity._id,'');
    }

    ngOnInit() : void {
        this.getMyFollows();
    }

    getMyFollows(){
        this._followService.getMyFollow(this.token).subscribe(
            response => {
                this.follows = response.follows;
            },
            error => {
                console.log(<any>error);
            }

        );
    }

    onSubmit(form){
        this._messageService.addMessage(this.token,this.message).subscribe(
            response =>{
                if(response.message != 'undefined'){
                    this.status = 'success';
                    form.reset();
                }else{
                    this.status = 'error';
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }
}
