import { IGrupoalbumartista } from './../model/grupoalbumartista.iterface';
import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPage } from '../environment/model.interface';
import { IArtista } from '../model/artista.interface';
import { IAlbum } from '../model/album.interface';

@Injectable({
  providedIn: 'root',
})

export class GrupoalbumartistaService {
    serverURL: string = serverURL + '/grupoalbumartista';
  
    constructor(private oHttp: HttpClient) {}
  
    getPage(
      page: number,
      size: number,
      field: string,
      dir: string,
      filtro: string
    ): Observable<IPage<IGrupoalbumartista>> {
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
      return this.oHttp.get<IPage<IGrupoalbumartista>>(URL, httpOptions);
    }
  
   
  
  
    get(id: number): Observable<IGrupoalbumartista> {
      let URL: string = '';
      URL += this.serverURL;
      URL += '/' + id;
      return this.oHttp.get<IGrupoalbumartista>(URL);
    }
  
    create(oGrupoalbumartista: IGrupoalbumartista): Observable<IGrupoalbumartista> {
      let URL: string = '';
      URL += this.serverURL;
      return this.oHttp.post<IGrupoalbumartista>(URL, oGrupoalbumartista);
    }
  
    update(oGrupoalbumartista: IGrupoalbumartista): Observable<IGrupoalbumartista> {
      let URL: string = '';
      URL += this.serverURL;
      return this.oHttp.put<IGrupoalbumartista>(URL, oGrupoalbumartista);
    }
  
    delete(id: number) {
      let URL: string = '';
      URL += this.serverURL;
      URL += '/' + id;
      return this.oHttp.delete(URL);
    }

    updateArtistasToAlbum(idAlbum: number, artistas: IArtista[]): Observable<IArtista[]> {
      artistas.forEach((artista) => {
        artista.grupoalbumartistas = []
      })
      let URL: string = '';
      URL += this.serverURL;
      URL += '/artistas/' + idAlbum;
      return this.oHttp.put<IArtista[]>(URL, artistas);
    }

    updateAlbumesToArtista(idArtista: number, albumes: IAlbum[]): Observable<IAlbum[]> {
      albumes.forEach((album) => {
        album.grupoalbumartistas = []
        album.resenyas = []
      })
      let URL: string = '';
      URL += this.serverURL;
      URL += '/albumes/' + idArtista;
      return this.oHttp.put<IAlbum[]>(URL, albumes);
    }
  }
  