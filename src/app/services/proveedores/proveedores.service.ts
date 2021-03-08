import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { apiURL } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(private http: HttpClient) { }

  async consultaProveedores(){
    try {
      let url = `${apiURL}/Proveedores`;
      return await this.http.get(url).pipe(
        map((resp: any) => {
          return resp || [];
        }) 
      ).toPromise();
    } catch (e) { 
      throw e;
    }
  }
}
