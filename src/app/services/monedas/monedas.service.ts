import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { apiURL } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class MonedasService {

  constructor(private http: HttpClient) { }

  async consultaMonedas(){
    try {
      let url = `${apiURL}/Monedas`;
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
