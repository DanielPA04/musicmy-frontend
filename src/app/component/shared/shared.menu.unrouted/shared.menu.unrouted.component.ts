import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { SessionService } from '../../../service/session.service';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';

@Component({
  selector: 'app-shared-menu-unrouted',
  templateUrl: './shared.menu.unrouted.component.html',
  styleUrls: ['./shared.menu.unrouted.component.css'],
  imports: [RouterLink],
  standalone: true,
})
export class SharedMenuUnroutedComponent implements OnInit {
  strRuta: string = '';
  activeSession: boolean = false;
  userEmail: string = '';
  permisos: string = '';


  constructor(private oRouter: Router, private oSessionService: SessionService, private oUsuarioService: UsuarioService) {
    this.oRouter.events.subscribe((oEvent) => {
      if (oEvent instanceof NavigationEnd) {
        this.strRuta = oEvent.url;
      }
    });
    this.activeSession = this.oSessionService.isSessionActive();
    if (this.activeSession) {
      this.userEmail = this.oSessionService.getSessionEmail();
      this.oUsuarioService.getUsuarioByEmail(this.userEmail).subscribe({
        next: (data: IUsuario) => {
          this.permisos = data.tipousuario.nombre
        }
      });

    }

  }

  ngOnInit() {
    this.oSessionService.onLogin().subscribe({
      next: () => {
        this.activeSession = true;
        this.userEmail = this.oSessionService.getSessionEmail();
        this.oUsuarioService.getUsuarioByEmail(this.userEmail).subscribe({
          next: (data: IUsuario) => {
            this.permisos = data.tipousuario.nombre
          }
        });
      },
    });
    this.oSessionService.onLogout().subscribe({
      next: () => {
        this.activeSession = false;
        this.userEmail = '';
        this.permisos = '';
      },
    });
  }


}
