import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../environment/environment';
import { Observable, throwError } from 'rxjs';
import { ILogin } from '../model/login.interface';
import { CryptoService } from './crypto.service';
import { ITokenDTO } from '../model/dto/TokenDTO.interface';
import { IChangePwdDTO } from '../model/dto/change-pwd.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  serverURL: string = serverURL + '/auth';

  constructor(private oHttp: HttpClient, private oCrypto: CryptoService) {}

  login(oLogin: ILogin): Observable<string> {
    oLogin.password = this.oCrypto.getHashSHA256(oLogin.password);
    let URL: string = '';
    URL += this.serverURL;
    URL += '/login';
    return this.oHttp.post<string>(URL, oLogin);
  }

  verify(token: string): Observable<string> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/verify';

    let tokenDTO: ITokenDTO = { token: token };

    return this.oHttp.post<string>(URL, tokenDTO);
  }

  resendVerificationEmail(credential: string): Observable<string> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/resendCode/verify/' + credential;
    return this.oHttp.get<string>(URL);
  }

  isVerified(credential: string): Observable<boolean> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/isVerified/' + credential;
    return this.oHttp.get<boolean>(URL);
  }

  sendCodeChangePassword(credential: string): Observable<string> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/sendCode/resetPassword/' + credential;
    return this.oHttp.get<string>(URL);
  }

  // Usar uno de los dos casos del if al llamar al metodo
  changePassword(
    newPassword: string,
    email?: string,
    oldPassword?: string,
    token?: string
  ): Observable<string> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/changePassword';
    newPassword = this.oCrypto.getHashSHA256(newPassword);

    let oChangePassword: IChangePwdDTO = { newPassword: newPassword };

    if (email && oldPassword) {
      oldPassword = this.oCrypto.getHashSHA256(oldPassword);
      oChangePassword.email = email;
      oChangePassword.oldPassword = oldPassword;
      return this.oHttp.post<string>(URL, oChangePassword);
    } else if (token) {
      oChangePassword.token = token;
      return this.oHttp.post<string>(URL, oChangePassword);
    } else {
      return throwError(
        () => new Error('Debes proporcionar un token o email y oldPassword')
      );
    }
  }
}
