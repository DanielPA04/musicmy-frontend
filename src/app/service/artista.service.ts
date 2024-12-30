import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IArtista } from '../model/artista.interface';
import { Observable } from 'rxjs';
import { IPage } from '../model/model.interface';

@Injectable({
  providedIn: 'root',
})
export class ArtistaService {
  serverURL: string = serverURL + '/artista';

  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<IArtista>> {
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
    return this.oHttp.get<IPage<IArtista>>(URL, httpOptions);
  }

 


  get(id: number): Observable<IArtista> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IArtista>(URL);
  }

  create(oArtista: IArtista): Observable<IArtista> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<IArtista>(URL, oArtista);
  }

  update(oArtista: IArtista): Observable<IArtista> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<IArtista>(URL, oArtista);
  }

  getOne(id: number): Observable<IArtista> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IArtista>(URL);
  }

  delete(id: number) {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.delete(URL);
  }
}
