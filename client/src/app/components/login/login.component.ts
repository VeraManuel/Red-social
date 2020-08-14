import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public title: String;

  constructor() {
    this.title = 'Identificate';
   }

  ngOnInit(): void {
    console.log('componente login cargado...')
  }

}
