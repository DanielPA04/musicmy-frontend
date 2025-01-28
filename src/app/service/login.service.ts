import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { serverURL } from "../environment/environment";
import { Observable } from "rxjs";
import { ILogin } from "../model/login.interface";
import { CryptoService } from "./crypto.service";

@Injectable({
    providedIn: 'root'
  })
  
  export class LoginService {
  
    serverURL: string = serverURL + '/auth';
  
    constructor(private oHttp: HttpClient, private oCrypto: CryptoService) { }
  
    login(oLogin : ILogin): Observable<string> {
        oLogin.password = this.oCrypto.getHashSHA256(oLogin.password);
        let URL: string = '';
        URL += this.serverURL;
        URL += '/login';
      return this.oHttp.post<string>(URL, oLogin);
    }
  }