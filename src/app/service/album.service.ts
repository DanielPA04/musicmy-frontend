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
      resenyas: dto.resenyas,
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

  async albumToDTO(album: IAlbum): Promise<IAlbumDTO> {
    const imgBase64 = album.img ? await this.blobToBase64(album.img) : '';
    return {
      id: album.id,
      nombre: album.nombre,
      fecha: album.fecha,
      genero: album.genero,
      descripcion: album.descripcion,
      discografica: album.discografica,
      imgBase64: imgBase64,
      grupoalbumartistas: album.grupoalbumartistas,
      resenyas: album.resenyas,
    };
  }
  

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]); // Extrae solo la parte base64
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsDataURL(blob);
    });
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
    return this.oHttp.get<IAlbumDTO>(URL).pipe(map((dto: IAlbumDTO) => this.convertAlbumDTOToAlbum(dto)));
  }

  create(oAlbum: IAlbum): Observable<IAlbum> {
    oAlbum.fecha = new Date(oAlbum.fecha).toISOString().split('T')[0];
    let URL: string = '';
    URL += this.serverURL;

    let album: Observable<IAlbumDTO> = this.oHttp.put<IAlbumDTO>(
      URL,
      this.albumToDTO(oAlbum)
    );
    return album.pipe(
      map((dto: IAlbumDTO) => this.convertAlbumDTOToAlbum(dto))
    );
  }

  async update(oAlbum: IAlbum): Promise<Observable<IAlbum>> {
    oAlbum.fecha = new Date(oAlbum.fecha).toISOString().split('T')[0];
    let URL: string = '';
    URL += this.serverURL;
  
    if (oAlbum.img) {
      URL += '/img';
  
      // Espera la conversión del álbum a DTO
      const albumDTO = await this.albumToDTO(oAlbum);
  
      // Realiza la petición con el DTO
      const a = this.oHttp.put<IAlbumDTO>(URL, albumDTO);
  
      return a.pipe(map((dto: IAlbumDTO) => this.convertAlbumDTOToAlbum(dto)));
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
