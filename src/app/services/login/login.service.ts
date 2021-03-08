import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { apiURL } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient,
              private router: Router) { }

  async login(username: string, password: string) {

    try {

      Swal.fire({
        title: 'Ingresando',
        text: 'Espere un momento por favor.',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        },
      });


      let url = `${apiURL}/login`;
      let body = `username=${username}&password=${password}&grant_type=password`;

      return await this.http.post(url, body).pipe(map( response => {
        this.guardaStorage(response);
        Swal.close();
        this.router.navigateByUrl('recibos');
      })).toPromise();
      
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: error.statusText
      })
    }
  }

  guardaStorage(datos: any){
    localStorage.setItem('auth_token', datos.access_token);
    localStorage.setItem('refresh_token', datos.refresh_token);
    localStorage.setItem('expires_in', datos.expires_in);
    localStorage.setItem('nombre', datos.nombre);
    localStorage.setItem('apellidoMaterno', datos.apellidoMaterno);
    localStorage.setItem('apellidoPaterno', datos.apellidoPaterno);
  }

}
