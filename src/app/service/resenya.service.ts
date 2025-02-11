import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IResenya } from '../model/resenya.interface';
import { Observable } from 'rxjs';
import { IPage } from '../environment/model.interface';

@Injectable({
  providedIn: 'root',
})

export class ResenyaService {
    serverURL: string = serverURL + '/resenya';
  
    constructor(private oHttp: HttpClient) {}
  
    getPage(
      page: number,
      size: number,
      field: string,
      dir: string,
      filtro: string
    ): Observable<IPage<IResenya>> {
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
      return this.oHttp.get<IPage<IResenya>>(URL, httpOptions);
    }
  
   
  
  
    get(id: number): Observable<IResenya> {
      let URL: string = '';
      URL += this.serverURL;
      URL += '/' + id;
      return this.oHttp.get<IResenya>(URL);
    }
  
    create(oResenya: IResenya): Observable<IResenya> {
      oResenya.album.resenyas = [];
      oResenya.album.grupoalbumartistas = [];
      oResenya.usuario.resenyas = [];
      oResenya.usuario.tipousuario.usuarios = [];


      let URL: string = '';
      URL += this.serverURL;
      return this.oHttp.post<IResenya>(URL, oResenya);
    }
  
    update(oResenya: IResenya): Observable<IResenya> {
      oResenya.album.resenyas = [];
      oResenya.album.grupoalbumartistas = [];
      oResenya.usuario.resenyas = [];
      oResenya.usuario.tipousuario.usuarios = [];
      let URL: string = '';
      URL += this.serverURL;
      return this.oHttp.put<IResenya>(URL, oResenya);
    }
  
    delete(id: number) {
      let URL: string = '';
      URL += this.serverURL;
      URL += '/' + id;
      return this.oHttp.delete(URL);
    }
  }
  