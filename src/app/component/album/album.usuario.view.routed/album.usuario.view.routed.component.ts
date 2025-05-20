import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../service/album.service';
import { IPage } from '../../../environment/model.interface';
import { IAlbum } from '../../../model/album.interface';
import { BlobToUrlPipe } from '../../../pipe/blob.pipe';
import { ArtistaService } from '../../../service/artista.service';
import { IArtista } from '../../../model/artista.interface';
import { SessionService } from '../../../service/session.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ResenyaService } from '../../../service/resenya.service';
import { UsuarioService } from '../../../service/usuario.service';
import { IResenya } from '../../../model/resenya.interface';
import { serverURL } from '../../../environment/environment';
import { CommonModule } from '@angular/common';
import { ResenyaLikeService } from '../../../service/resenya-like.service';
import { IUsuario } from '../../../model/usuario.interface';

@Component({
  selector: 'app-album.usuario.view.routed',
  templateUrl: './album.usuario.view.routed.component.html',
  styleUrls: ['./album.usuario.view.routed.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, CommonModule],
})
export class AlbumUsuarioViewRoutedComponent implements OnInit {
  album: IAlbum | null = null;
  artistas: IArtista[] = [];
  media: number = 0;
  resenyas: IPage<IResenya> = {} as IPage<IResenya>;
  email: string = '';
  id: number = 0;
  activeSession: boolean = false;
  isResenyaExist: boolean = true;
  serverURL: string = serverURL;
  usuario: IUsuario = {} as IUsuario;
  constructor(
    private oAlbumService: AlbumService,
    private oArtistaService: ArtistaService,
    private oUsuarioService: UsuarioService,
    private oSessionService: SessionService,
    private oResenyaService: ResenyaService,
    private oActivedRoute: ActivatedRoute,
    private oResenyaLikeService: ResenyaLikeService
  ) {}

  ngOnInit(): void {
    this.id = this.oActivedRoute.snapshot.params['id'];
    this.activeSession = this.oSessionService.isSessionActive();
    this.email = this.oSessionService.getSessionEmail();
    this.getUserByJwt();
    this.get();
  }

  getUserByJwt() {
  
    this.oUsuarioService.getUsuarioByEmail(this.email).subscribe({
      next: (data: IUsuario) => {
        this.usuario = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get() {
    this.oAlbumService.get(this.id).subscribe({
      next: (album: IAlbum) => {
        this.album = album;

        this.oArtistaService.getByAlbum(album.id).subscribe({
          next: (data: IArtista[]) => {
            this.artistas = data;
          },
          error: (err) => {
            console.log(err);
          },
        });
        this.oAlbumService.getMedia(album.id).subscribe({
          next: (data: number) => {
            console.log('media' + data);
            this.media = data;
          },
          error: (err) => {
            console.log(err);
          },
        });
        this.oAlbumService.getImg(album.id).subscribe({
          next: (data) => {
            album.img = data;
          },
        });

        this.oResenyaService
          .checkIfResenyaExistsByEmailAndAlbumId(this.email, album.id)
          .subscribe({
            next: (data: boolean) => {
              this.isResenyaExist = data;
            },
            error: (err) => {
              console.log(err);
            },
          });

        this.oResenyaService.getPageByAlbum(album.id, 0, 10, '', '').subscribe({
          next: (data: IPage<IResenya>) => {
            this.resenyas = data;
            this.resenyas.content.forEach((resenya: IResenya) => {
              this.oResenyaLikeService
                .hasUserLiked(this.usuario.id, resenya.id)
                .subscribe({
                  next: (data: { liked: boolean }) => {
                    resenya.liked = data.liked;
                  },
                  error: (err) => {
                    console.log(err);
                  },
                });
            });
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

 toggleLike(resenyaId: number): void {
  if (!this.activeSession || !this.usuario.id) return;

  const resenya = this.resenyas.content.find((r) => r.id === resenyaId);
  if (!resenya) return;

  if (resenya.liked) {
    this.oResenyaLikeService
      .unlikeResenya(this.usuario.id, resenyaId)
      .subscribe({
        next: () => {
          resenya.liked = false;
          if (resenya.likeCount !== undefined && resenya.likeCount > 0) {
            resenya.likeCount--;
          }
        },
        error: (err) => console.error(err),
      });
  } else {
    this.oResenyaLikeService
      .likeResenya(this.usuario.id, resenyaId)
      .subscribe({
        next: () => {
          resenya.liked = true;
          if (resenya.likeCount !== undefined) {
            resenya.likeCount++;
          } else {
            resenya.likeCount = 1;
          }
        },
        error: (err) => console.error(err),
      });
  }
}


  getBackgroundClass(nota: number): string {
    if (nota < 5) {
      return 'bg-low-grade';
    } else if (nota >= 5 && nota < 7) {
      return 'bg-medium-grade';
    } else if (nota >= 7 && nota < 8) {
      return 'bg-high-grade';
    } else {
      return 'bg-excellent-grade';
    }
  }
}
