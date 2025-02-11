import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { ITipousuario } from '../model/tipousuario.iterface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPage } from '../environment/model.interface';

@Injectable({
  providedIn: 'root',
})
export class TipousuarioService {
  serverURL: string = serverURL + '/tipousuario';

  constructor(private oHttp: HttpClient) { }


  

  getPage(
    page: number,
    size: number,
    field: string ,
    dir: string ,
    filtro: string 
  ): Observable<IPage<ITipousuario>> {
    let URL: string = '';
    URL += this.serverURL;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<ITipousuario>>(URL, httpOptions);
  }

}