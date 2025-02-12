import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IAlbum } from '../model/album.interface';
import { map, Observable } from 'rxjs';
import { IPage } from '../environment/model.interface';

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

  getPageLastMonth(
    page: number,
    size: number,
    field: string,
    dir: string
  ): Observable<IPage<IAlbum>> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/lastmonth';
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

    return this.oHttp.get<IPage<IAlbum>>(URL, httpOptions);
  }

  get(id: number): Observable<IAlbum> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IAlbum>(URL);
  }

  getImg(id: number): Observable<Blob> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id + '/img';
    return this.oHttp.get(URL, { responseType: 'blob' });
  }

  getMedia(id: number): Observable<number> {
    let URL: string = '';
    URL += this.serverURL;
    URL +=  '/media' + '/' + id;
    return this.oHttp.get<number>(URL);
  }

  create(oAlbum: IAlbum): Observable<IAlbum> {
    oAlbum.fecha = new Date(oAlbum.fecha).toISOString().split('T')[0];
    let URL: string = '';
    URL += this.serverURL;
    if (oAlbum.img) {
      URL += '/img';
      const formData = new FormData();
      formData.append('nombre', oAlbum.nombre);
      formData.append('fecha', oAlbum.fecha);
      formData.append('genero', oAlbum.genero);
      formData.append('descripcion', oAlbum.descripcion);
      formData.append('discografica', oAlbum.discografica);
      formData.append('img', oAlbum.img as Blob);

      return this.oHttp.post<IAlbum>(URL, formData);
    }

    return this.oHttp.post<IAlbum>(URL, oAlbum);
  }

   update(oAlbum: IAlbum): Observable<IAlbum> {
    oAlbum.fecha = new Date(oAlbum.fecha).toISOString().split('T')[0];
    let URL: string = '';
    URL += this.serverURL;

    if (oAlbum.img) {
      URL += '/img';
      const formData = new FormData();
      formData.append('id', oAlbum.id.toString());
      formData.append('nombre', oAlbum.nombre);
      formData.append('fecha', oAlbum.fecha);
      formData.append('genero', oAlbum.genero);
      formData.append('descripcion', oAlbum.descripcion);
      formData.append('discografica', oAlbum.discografica);
      formData.append('img', oAlbum.img as Blob);

      return this.oHttp.put<IAlbum>(URL, formData);
    }

    return this.oHttp.put<IAlbum>(URL, oAlbum);
  }

  delete(id: number) {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.delete(URL);
  }
}
