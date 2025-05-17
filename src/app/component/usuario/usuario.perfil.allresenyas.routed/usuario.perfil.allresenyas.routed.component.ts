import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { IPage } from '../../../environment/model.interface';
import { IResenya } from '../../../model/resenya.interface';
import { IUsuario } from '../../../model/usuario.interface';
import { IArtista } from '../../../model/artista.interface';
import { ResenyaService } from '../../../service/resenya.service';
import { UsuarioService } from '../../../service/usuario.service';
import { ArtistaService } from '../../../service/artista.service';
import { BotoneraService } from '../../../service/botonera.service';
import { firstValueFrom } from 'rxjs';
import { serverURL } from '../../../environment/environment';

@Component({
  selector: 'app-usuario-perfil-allresenyas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuario.perfil.allresenyas.routed.component.html',
  styleUrls: ['./usuario.perfil.allresenyas.routed.component.css']
})
export class UsuarioPerfilAllresenyasRoutedComponent implements OnInit {
  email!: string;
  pageType: 'recent' | 'best' = 'recent';
  nPage = 0;
  nRpp = 10;

  usuario!: IUsuario;
  oPage!: IPage<IResenya>;
  nombresArtista = new Map<number, IArtista[]>();
  arrBotonera: string[] = [];
  isLoading = false;

  serverURL = serverURL;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resenyaService: ResenyaService,
    private usuarioService: UsuarioService,
    private artistaService: ArtistaService,
    private botoneraService: BotoneraService
  ) {}

  async ngOnInit() {
    this.email = this.route.snapshot.params['email'];

    this.route.queryParamMap.subscribe(async params => {
      const t = params.get('type');
      this.pageType = t === 'best' ? 'best' : 'recent';
      this.nPage = +(params.get('page') ?? 0);

      if (!this.usuario) {
        this.usuario = await firstValueFrom(
          this.usuarioService.getUsuarioByEmail(this.email)
        );
      }

      this.fetchPage();
    });
  }

  private fetchPage() {
    this.isLoading = true; // empezamos carga
    const obs = this.pageType === 'recent'
      ? this.resenyaService.getPageByUsuarioRecent(this.usuario.id, this.nPage, this.nRpp)
      : this.resenyaService.getPageByUsuarioBest(this.usuario.id, this.nPage, this.nRpp);

    obs.subscribe(page => {
      this.oPage = page;
      this.arrBotonera = this.botoneraService.getBotonera(this.nPage, page.totalPages);
      page.content.forEach(r => {
        this.artistaService.getByAlbum(r.album.id).subscribe(a => {
          this.nombresArtista.set(r.album.id, a);
        });
      });
      this.isLoading = false; // termina carga
    });
  }

  getArtistasNames(albumId: number): string {
    const arr = this.nombresArtista.get(albumId);
    return arr ? arr.map(a => a.nombre).join(', ') : '';
  }

  switchType(type: 'recent' | 'best') {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type, page: 0 },
      queryParamsHandling: 'merge'
    });
  }

  goToPage(p: string) {
    if (p === '...') return;
    const pageIndex = parseInt(p, 10) - 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: this.pageType, page: pageIndex },
      queryParamsHandling: 'merge'
    });
  }

  goToPrev() {
    if (this.nPage > 0) {
      this.goToPage((this.nPage).toString());
    }
  }

  goToNext() {
    if (this.oPage && this.nPage + 1 < this.oPage.totalPages) {
      this.goToPage((this.nPage + 2).toString());
    }
  }
}
