import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IAlbum } from '../model/album.interface';
import { Observable } from 'rxjs';
import { IPage } from '../model/model.interface';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  serverURL: string = serverURL + '/album';

  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<IAlbum>> {
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
    return this.oHttp.get<IPage<IAlbum>>(URL, httpOptions);
  }

 


  get(id: number): Observable<IAlbum> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IAlbum>(URL);
  }

  create(oAlbum: IAlbum): Observable<IAlbum> {
    let URL: string = '';
    URL += this.serverURL;
    console.log(oAlbum);
    if (oAlbum.img) {
      const formData = new FormData();
      formData.append('nombre', oAlbum.nombre);
      formData.append('fecha', oAlbum.fecha);
      formData.append('genero', oAlbum.genero);
      formData.append('descripcion', oAlbum.descripcion);
      formData.append('discografica', oAlbum.discografica);
      formData.append('img', oAlbum.img);
      
      return this.oHttp.post<IAlbum>(URL, formData);
    } else {
    return this.oHttp.post<IAlbum>(URL, oAlbum);
    }
  }

  update(oAlbum: IAlbum): Observable<IAlbum> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<IAlbum>(URL, oAlbum);
  }

  getOne(id: number): Observable<IAlbum> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IAlbum>(URL);
  }

  delete(id: number) {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.delete(URL);
  }
}
