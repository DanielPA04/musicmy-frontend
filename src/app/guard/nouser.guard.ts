import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionService } from "../service/session.service";


@Injectable({
    providedIn: 'root'
})

export class NoUserGuard implements CanActivate {

    constructor(private oSessionService: SessionService,
        private oRouter: Router) { }

    canActivate(): boolean {
        if (this.oSessionService.isSessionActive()) {
            this.oRouter.navigate(['/']);
            return false;
        } else {
            return true;
        }
       
    }

}