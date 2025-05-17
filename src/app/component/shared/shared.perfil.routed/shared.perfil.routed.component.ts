import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';
import { ResenyaService } from '../../../service/resenya.service';
import { IPage } from '../../../environment/model.interface';
import { IResenya } from '../../../model/resenya.interface';
import { BotoneraService } from '../../../service/botonera.service';
import { ArtistaService } from '../../../service/artista.service';
import { AlbumService } from '../../../service/album.service';
import { IArtista } from '../../../model/artista.interface';
import { IAlbum } from '../../../model/album.interface';
import { serverURL } from '../../../environment/environment';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { SessionService } from '../../../service/session.service';

@Component({
  selector: 'app-shared.perfil.routed',
  templateUrl: './shared.perfil.routed.component.html',
  styleUrls: ['./shared.perfil.routed.component.css'],
  imports: [CommonModule, RouterLink],
})
export class SharedPerfilRoutedComponent implements OnInit {
  email: string = '';
  usuario: IUsuario | null = null;

  // paginacion Resenya
  oPageRecent: IPage<IResenya> | null = null;
  oPageBest: IPage<IResenya> | null = null;

  arrBotonera: string[] = [];
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 5;
  //

  nombresArtista: Map<number, IArtista[]> = new Map<number, IArtista[]>();

  serverURL: string = serverURL;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oUsuarioService: UsuarioService,
    private oArtistaService: ArtistaService,
    private oResenyaService: ResenyaService,
    private oBotoneraService: BotoneraService,
    private oSessionService: SessionService
  ) {
    this.email = this.oActivatedRoute.snapshot.params['email'];
  }

  async ngOnInit() {
    this.usuario = await firstValueFrom(
      this.oUsuarioService.getUsuarioByEmail(this.email)
    );
    this.getPageRecent();
    this.getPageBest();
  }

  getPageRecent() {
    this.oResenyaService
      .getPageByUsuarioRecent(this.usuario!.id, this.nPage, this.nRpp)
      .subscribe({
        next: (data: IPage<IResenya>) => {
          this.oPageRecent = data;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            data.totalPages
          );
          this.oPageRecent.content.forEach((oResenya) => {
            this.oArtistaService.getByAlbum(oResenya.album.id).subscribe({
              next: (artistas: IArtista[]) => {
                this.nombresArtista.set(oResenya.album.id, artistas);
              },
            });
          });
        },
      });
  }

  getPageBest() {
    this.oResenyaService
      .getPageByUsuarioBest(this.usuario!.id, this.nPage, this.nRpp)
      .subscribe({
        next: (data: IPage<IResenya>) => {
          this.oPageBest = data;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            data.totalPages
          );
          this.oPageBest.content.forEach((oResenya) => {
            this.oArtistaService.getByAlbum(oResenya.album.id).subscribe({
              next: (artistas: IArtista[]) => {
                this.nombresArtista.set(oResenya.album.id, artistas);
              },
            });
          });
        },
      });
  }

  isUserLogged(): boolean {
    if (this.oSessionService.isSessionActive()) {
      this.oSessionService.getSessionEmail();
      if (this.oSessionService.getSessionEmail() === this.email) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  isMobileView(): boolean {
    return window.innerWidth < 768; // Tailwind breakpoint `md`
  }

  getVisibleResenyas(source: IResenya[]): IResenya[] {
    return this.isMobileView() ? source.slice(0, 4) : source;
  }
}
