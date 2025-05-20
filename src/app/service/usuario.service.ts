import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { IUsuario } from '../model/usuario.interface';
import { Observable } from 'rxjs/internal/Observable';
import { IPage } from '../environment/model.interface';
import { CryptoService } from './crypto.service';
import { IUsuarioRankingDTO } from '../model/dto/usuarioRankingDTO.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  serverURL: string = serverURL + '/usuario';

  constructor(
    private oHttp: HttpClient,
    private oCryptoService: CryptoService
  ) {}

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<IUsuario>> {
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
    return this.oHttp.get<IPage<IUsuario>>(URL, httpOptions);
  }

  get(id: number): Observable<IUsuario> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IUsuario>(URL);
  }

  create(oUsuario: IUsuario): Observable<IUsuario> {
    let URL: string = '';
    URL += this.serverURL;

    oUsuario.password = this.oCryptoService.getHashSHA256(oUsuario.password);
    oUsuario.fecha = new Date(oUsuario.fecha).toISOString().split('T')[0];
    oUsuario.tipousuario.usuarios = [];

    if (oUsuario.img) {
      URL += '/create/img';
      const formData = new FormData();
      formData.append('username', oUsuario.username);
      formData.append('nombre', oUsuario.nombre);
      formData.append('fecha', oUsuario.fecha);
      formData.append('descripcion', oUsuario.descripcion);
      formData.append('email', oUsuario.email);
      formData.append('password', oUsuario.password);
      formData.append('website', oUsuario.website);
      formData.append('img', oUsuario.img as Blob);
      formData.append('tipousuario', JSON.stringify(oUsuario.tipousuario));
      return this.oHttp.post<IUsuario>(URL, formData);
    }

    return this.oHttp.post<IUsuario>(URL, oUsuario);
  }

  register(oUsuario: IUsuario): Observable<IUsuario> {
    // TODO: mirar que esto se rahasea en caso de error
    let password = this.oCryptoService.getHashSHA256(oUsuario.password);
    oUsuario.password = password;

    let URL: string = '';
    URL += this.serverURL + '/register';
    return this.oHttp.post<IUsuario>(URL, oUsuario);
  }

  checkIfEmailExists(email: string): Observable<boolean> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/check/email/' + email;
    return this.oHttp.get<boolean>(URL);
  }

  checkIfUsernameExists(username: string): Observable<boolean> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/check/username/' + username;
    return this.oHttp.get<boolean>(URL);
  }

  update(oUsuario: IUsuario): Observable<IUsuario> {
    if (oUsuario.password) {
      oUsuario.password = this.oCryptoService.getHashSHA256(oUsuario.password);
      oUsuario.fecha = new Date(oUsuario.fecha).toISOString().split('T')[0];
    }
    oUsuario.tipousuario.usuarios = [];
    oUsuario.resenyas = [];
    let URL: string = '';
    URL += this.serverURL;

    if (oUsuario.img) {
      URL += '/update/img';
      const formData = new FormData();
      formData.append('id', oUsuario.id.toString());
      formData.append('username', oUsuario.username);
      formData.append('nombre', oUsuario.nombre);
      formData.append('fecha', oUsuario.fecha);
      formData.append('descripcion', oUsuario.descripcion);
      formData.append('email', oUsuario.email);
      formData.append('password', oUsuario.password);
      formData.append('website', oUsuario.website);
      formData.append('img', oUsuario.img as Blob);
      formData.append('tipousuario', JSON.stringify(oUsuario.tipousuario));
      return this.oHttp.put<IUsuario>(URL, formData);
    }

    return this.oHttp.put<IUsuario>(URL, oUsuario);
  }

  getOne(id: number): Observable<IUsuario> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IUsuario>(URL);
  }

  getUsuarioByEmail(email: string): Observable<IUsuario> {
    let URL: string = '';
    URL += this.serverURL + '/byemail';
    URL += '/' + email;
    return this.oHttp.get<IUsuario>(URL);
  }

  getTop20() {
    let URL: string = '';
    URL += this.serverURL + '/ranking';
    return this.oHttp.get<IUsuarioRankingDTO[]>(URL);
  }

  delete(id: number) {
    return this.oHttp.delete(this.serverURL + '/' + id);
  }
}
