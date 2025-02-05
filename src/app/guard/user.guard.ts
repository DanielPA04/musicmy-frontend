import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionService } from "../service/session.service";
import { map, Observable } from "rxjs";
import { IUsuario } from "../model/usuario.interface";
import { UsuarioService } from "../service/usuario.service";

@Injectable({
    providedIn: 'root'
})

export class UserGuard implements CanActivate {

    constructor(private oSessionService: SessionService,
        private oUsuarioService: UsuarioService,
        private oRouter: Router) { }

    canActivate(): boolean {
        if (this.oSessionService.isSessionActive()) {
            return true;
        } else {
            this.oRouter.navigate(['/']);
            return false;
        }
       
    }

}