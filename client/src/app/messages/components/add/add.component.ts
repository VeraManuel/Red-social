import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from "../../../services/user.service";
import { MessageService } from '../../../services/message.service';
import { GLOBAL } from '../../../services/global';

@Component({
    selector: 'add',
    templateUrl: './add.component.html',
    providers: [UserService, MessageService]
})
export class AddComponent implements OnInit{
    public title: string;
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,

    ){
        this.title = 'Enviar mensaje';
        this.url = GLOBAL.url;
    }

    ngOnInit() : void {
        
    }
}
