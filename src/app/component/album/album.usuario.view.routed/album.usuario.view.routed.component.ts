// album.usuario.view.routed.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { AlbumService } from '../../../service/album.service';
import { IPage } from '../../../environment/model.interface';
import { IAlbum } from '../../../model/album.interface';
import { ArtistaService } from '../../../service/artista.service';
import { IArtista } from '../../../model/artista.interface';
import { SessionService } from '../../../service/session.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ResenyaService } from '../../../service/resenya.service';
import { ResenyaLikeService } from '../../../service/resenya-like.service';
import { UsuarioService } from '../../../service/usuario.service';
import { IResenya } from '../../../model/resenya.interface';
import { IUsuario } from '../../../model/usuario.interface';
import { BotoneraService } from '../../../service/botonera.service';
import { serverURL } from '../../../environment/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album.usuario.view.routed',
  templateUrl: './album.usuario.view.routed.component.html',
  styleUrls: ['./album.usuario.view.routed.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class AlbumUsuarioViewRoutedComponent implements OnInit {
  album: IAlbum | null = null;
  artistas: IArtista[] = [];
  media = 0;
  resenyas: IPage<IResenya> = {} as IPage<IResenya>;
  usuario: IUsuario = {} as IUsuario;
  serverURL = serverURL;

  // Paginación y orden
  sortBy: 'fecha' | 'likes' = 'fecha';
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  pages: string[] = [];

  // Sesión
  activeSession = false;
  isResenyaExist = false;
  resenyaExistenteId!: number;
    email = '';
  id = 0;


   

  constructor(
    private albumSvc: AlbumService,
    private artistaSvc: ArtistaService,
    private usuarioSvc: UsuarioService,
    private sessionSvc: SessionService,
    private resenyaSvc: ResenyaService,
    private likeSvc: ResenyaLikeService,
    private botoneraSvc: BotoneraService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.activeSession = this.sessionSvc.isSessionActive();
    this.email = this.sessionSvc.getSessionEmail();
    this.loadAlbum();
    this.fetchUsuario();
  }

  private loadAlbum() {
    this.albumSvc.get(this.id).subscribe((album) => {
      this.album = album;
      this.loadArtistas(album.id);
      this.loadMedia(album.id);
      this.loadImg(album.id);
      this.checkResenyaExist();
      // Carga inicial de reseñas
      this.loadResenyas(0);
    });
  }

  private loadArtistas(albumId: number) {
    this.artistaSvc.getByAlbum(albumId).subscribe((a) => (this.artistas = a));
  }
  private loadMedia(albumId: number) {
    this.albumSvc.getMedia(albumId).subscribe((m) => (this.media = m));
  }
  private loadImg(albumId: number) {
    this.albumSvc.getImg(albumId).subscribe((img) => {
      if (this.album) this.album.img = img;
    });
  }
   private checkResenyaExist() {
    this.resenyaSvc
      .findResenyaByEmailAndAlbumId(this.email, this.id)
      .subscribe({
        next: (res: IResenya) => {
          this.isResenyaExist = true;
          this.resenyaExistenteId = res.id;
        },
        error: err => {
          if (err.status === 404) {
            this.isResenyaExist = false;
          } else {
            console.error(err);
          }
        }
      });
  }
  private fetchUsuario() {
    if (!this.email) return;
    this.usuarioSvc
      .getUsuarioByEmail(this.email)
      .subscribe((u) => (this.usuario = u));
  }

  /** Carga página de reseñas, por fecha o por likes */
  loadResenyas(page: number) {
    this.currentPage = page;
    const svcCall =
      this.sortBy === 'fecha'
        ? this.resenyaSvc.getPageByAlbum(
            this.id,
            page,
            this.pageSize,
            'fecha',
            ''
          )
        : this.resenyaSvc.getPageByAlbumAndLikes(
            this.id,
            page,
            this.pageSize,
            '',
            ''
          );

    svcCall.subscribe((data) => {
      this.resenyas = data;
      this.totalPages = data.totalPages;
      this.pages = this.botoneraSvc.getBotonera(
        this.currentPage,
        this.totalPages
      );
      // marcar likes para cada reseña
      data.content.forEach((r) => {
        this.likeSvc
          .hasUserLiked(this.usuario.id, r.id)
          .subscribe((res) => (r.liked = res.liked));
      });
    });
  }

  /** Cambia el criterio de orden y recarga desde la página 0 */
  changeSort(sort: 'fecha' | 'likes') {
    if (this.sortBy !== sort) {
      this.sortBy = sort;
      this.loadResenyas(0);
    }
  }

  /** Navegar a una página concreta */
  onPageChange(p: string) {
    if (p === '...') return;
    const target = +p - 1;
    if (target !== this.currentPage) {
      this.loadResenyas(target);
    }
  }

  goToPage(p: number) {
    if (!this.resenyas) return;
    this.currentPage = Math.max(0, Math.min(p, this.resenyas.totalPages - 1));
    this.loadResenyas(this.currentPage);
  }

  /** Maneja el like/unlike */
  toggleLike(resenyaId: number): void {
    if (!this.activeSession || !this.usuario.id) return;
    const r = this.resenyas.content.find((x) => x.id === resenyaId);
    if (!r) return;

    if (r.liked) {
      // rama UNLIKE
      this.likeSvc.unlikeResenya(this.usuario.id, resenyaId).subscribe(
        () => {
          r.liked = false;
          if (r.likeCount! > 0) r.likeCount!--;
        },
        (err) => console.error(err)
      );
    } else {
      // rama LIKE
      this.likeSvc.likeResenya(this.usuario.id, resenyaId).subscribe(
        () => {
          r.liked = true;
          r.likeCount = (r.likeCount || 0) + 1;
        },
        (err) => console.error(err)
      );
    }
  }

  /** Clase de fondo según nota (ya tenías algo similar) */
  getBackgroundClass(nota: number): string {
    if (nota < 5) return 'bg-low-grade';
    if (nota < 7) return 'bg-medium-grade';
    if (nota < 9) return 'bg-high-grade';
    return 'bg-excellent-grade';
  }



}
