import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credenciales = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private user: LoginService) { }

  ngOnInit(): void {

  }

  async iniciarSesion(){
    if(!this.credenciales.valid){
      Swal.fire({
        title: 'Faltan campos',
        text: 'Por favor ingrese los datos faltantes',
        icon: 'warning'
      });
      return;
    }
    let respuesta = await this.user.login(this.credenciales.controls["username"].value, this.credenciales.controls["password"].value);
    
  }

}
