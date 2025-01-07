import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IAlbum } from '../model/album.interface';
import { map, Observable } from 'rxjs';
import { IPage } from '../model/model.interface';
import { IAlbumDTO } from '../model/albumDTO.interface';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  serverURL: string = serverURL + '/album';

  constructor(private oHttp: HttpClient) {}

  convertAlbumDTOToAlbum(dto: IAlbumDTO): IAlbum {
    return {
      id: dto.id,
      nombre: dto.nombre,
      fecha: dto.fecha,
      genero: dto.genero,
      descripcion: dto.descripcion,
      discografica: dto.discografica,
      img: dto.imgBase64 ? this.base64ToBlob(dto.imgBase64) : new Blob(),
      grupoalbumartistas: dto.grupoalbumartistas,
    };
  }

  // Método para convertir Base64 a Blob
  base64ToBlob(base64: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters).map((char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray]);
  }

  convertPageOfAlbums(page: IPage<IAlbumDTO>): IPage<IAlbum> {
    return {
      ...page,
      content: page.content.map((dto) => this.convertAlbumDTOToAlbum(dto)),
    };
  }

  albumToDTO(album: IAlbum): IAlbumDTO {
    return {
      id: album.id,
      nombre: album.nombre,
      fecha: album.fecha,
      genero: album.genero,
      descripcion: album.descripcion,
      discografica: album.discografica,
      imgBase64: album.img ? this.blobToBase64(album.img) : undefined,
      grupoalbumartistas: album.grupoalbumartistas,
    };
  }

  blobToBase64(blob: Blob): string {
    const reader = new FileReader();
    let base64String = '';

    reader.onloadend = () => {
      base64String = reader.result as string;
    };

    reader.readAsDataURL(blob);
    return base64String.split(',')[1];
  }

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

    return this.oHttp
      .get<IPage<IAlbumDTO>>(URL, httpOptions)
      .pipe(
        map((albumDTO: IPage<IAlbumDTO>) => this.convertPageOfAlbums(albumDTO))
      );
  }

  get(id: number): Observable<IAlbum> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp
      .get<IAlbumDTO>(URL)
      .pipe(map((dto: IAlbumDTO) => this.convertAlbumDTOToAlbum(dto)));
  }

  create(oAlbum: IAlbum): Observable<IAlbum> {
    let URL: string = '';
    URL += this.serverURL;
    console.log(oAlbum);
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
    } else {
      return this.oHttp.post<IAlbum>(URL, oAlbum);
    }
  }

  update(oAlbum: IAlbum): Observable<IAlbum> {
    let URL: string = '';
    URL += this.serverURL;
    if (oAlbum.img) {
      URL += '/img';
       let album: Observable<IAlbumDTO> = this.oHttp.put<IAlbumDTO>(URL, this.albumToDTO(oAlbum));
      return album.pipe(map((dto: IAlbumDTO) => this.convertAlbumDTOToAlbum(dto))); 
    } else {
      return this.oHttp.put<IAlbum>(URL, oAlbum);
    }
  }

  delete(id: number) {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.delete(URL);
  }
}
