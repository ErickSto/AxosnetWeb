import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { apiURL } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class RecibosService {

  constructor(private http: HttpClient) { }

  async consultaRecibos(fechaInicio: string = '1900-01-01', fechaFin: string = '1900-01-01', Id_proveedor: number = 0, pag: number = 1, regPag: number = 50){
    try {
      let url = `${apiURL}/Recibo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&moneda_Id=0&proveedor_Id=${Id_proveedor}&paginaActual=${pag}&regPag=${regPag}`;
      return await this.http.get(url).pipe(
        map((resp: any) => {
          return resp || [];
        }) 
      ).toPromise();
    } catch (e) { 
      throw e;
    }
  }

  async consultaRecibo(Id_recibo: number){
    try {
      let url = `${apiURL}/Recibo/${Id_recibo}`;
      return await this.http.get(url).pipe(
        map((resp: any) => {
          return resp || [];
        }) 
      ).toPromise();
    } catch (e) { 
      throw e;
    }

  }

  async eliminarRecibo(Id_recibo: number){
    try {

      Swal.fire({
        title: 'Eliminando',
        text: 'Espere un momento por favor.',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        },
      });

      let url = `${apiURL}/Recibo/${Id_recibo}`;

      return await this.http.delete(url).pipe(map( response => {
        return response;
      })).toPromise();
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: error.statusText
      })
    } finally{
      Swal.close();
    }
  }

  async editaRecibo (Id_recibo: number, Id_moneda: number, Id_proveedor: number, comentario: string, monto: number){
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    const Datos = {
      Id_recibo: Id_recibo,
      moneda_Id: Id_moneda,
      proveedor_Id: Id_proveedor,
      monto: monto,
      comentario: comentario

    };
    const url = `${apiURL}/Recibo`;
    try {        
      return await this.http.put(url, Datos, config).pipe(
        map((resp: any) => {
          return resp;
        })).toPromise(); 
    } catch (error) {
      return error;
    }    
  }
  
  async guardaRecibo (Id_moneda: number, Id_proveedor: number, comentario: string, monto: number){
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    const Datos = {
      moneda_Id: Id_moneda,
      proveedor_Id: Id_proveedor,
      monto: monto,
      comentario: comentario
    };
    const url = `${apiURL}/Recibo`;
    try {        
      return await this.http.post(url, Datos, config).pipe(
        map((resp: any) => {
          return resp;
        })).toPromise(); 
    } catch (error) {
      return error;
    }    
  }

}
