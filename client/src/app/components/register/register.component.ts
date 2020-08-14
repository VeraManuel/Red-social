import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public title: String;

  constructor() {
    this.title = 'Registrate';
   }

  ngOnInit(): void {
    console.log('Componente register cargado...');
  }

}
