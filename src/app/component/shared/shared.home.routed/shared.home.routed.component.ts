import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumService } from "../../../service/album.service";
import { IPage } from "../../../environment/model.interface";
import { IAlbum } from "../../../model/album.interface";
import { ArtistaService } from "../../../service/artista.service";
import { IArtista } from '../../../model/artista.interface';
import { serverURL } from "../../../environment/environment";
import { SessionService } from "../../../service/session.service";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shared-home-routed',
  templateUrl: './shared.home.routed.component.html',
  styleUrls: ['./shared.home.routed.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})

export class SharedHomeRoutedComponent implements OnInit {
  oPageTopRated: IPage<IAlbum> = {} as IPage<IAlbum>
  oPageNew: IPage<IAlbum> = {} as IPage<IAlbum>
  oPagePopular: IPage<IAlbum> = {} as IPage<IAlbum>

  nombresArtista: Map<number, IArtista[]> = new Map<number, IArtista[]>()
  mediasAlbum: Map<number, number> = new Map<number, number>()

  nPage: number = 0
  nRpp: number = 12
  strField: string = ''
  strDir: string = ''
  strFiltro: string = ''
  serverURL: string = serverURL

  constructor(private oAlbumService: AlbumService, private oArtistaService: ArtistaService) { }

  ngOnInit(): void {
    this.getTopRated()
    this.getNew()
    this.getPopular()

  }

  getNew() {
    this.oAlbumService
      .getPageNew(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
      )
      .subscribe({
        next: (oPageFromServer: IPage<IAlbum>) => {
          this.oPageNew = oPageFromServer;
          
          this.oPageNew.content.forEach((oAlbum) => {
            this.oArtistaService.getByAlbum(oAlbum.id).subscribe({
              next: (data: IArtista[]) => {
                this.nombresArtista.set(oAlbum.id, data)
              },
              error: (err) => {
                console.log(err);
              },

            });
            this.oAlbumService.getMedia(oAlbum.id).subscribe({
              next: (data: number) => {
                this.mediasAlbum.set(oAlbum.id, data)
              },
              error: (err) => {
                console.log(err);
              },
            })
            this.oAlbumService.getImg(oAlbum.id).subscribe({
              next: (data) => {
                oAlbum.img = data;
              },
            });

          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getTopRated() {
    this.oAlbumService
      .getPageTopRated(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
      )
      .subscribe({
        next: (oPageFromServer: IPage<IAlbum>) => {
          this.oPageTopRated = oPageFromServer;
          // this.arrBotonera = this.oBotoneraService.getBotonera(
          //   this.nPage,
          //   oPageFromServer.totalPages
          // );
          this.oPageTopRated.content.forEach((oAlbum) => {
            this.oArtistaService.getByAlbum(oAlbum.id).subscribe({
              next: (data: IArtista[]) => {
                this.nombresArtista.set(oAlbum.id, data)
              },
              error: (err) => {
                console.log(err);
              },

            });
            this.oAlbumService.getMedia(oAlbum.id).subscribe({
              next: (data: number) => {
                this.mediasAlbum.set(oAlbum.id, data)
              },
              error: (err) => {
                console.log(err);
              },
            })
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }


    getPopular() {
    this.oAlbumService
      .getPagePopularRecent(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
      )
      .subscribe({
        next: (oPageFromServer: IPage<IAlbum>) => {
          this.oPagePopular = oPageFromServer;
          console.log(this.nombresArtista);
          this.oPagePopular.content.forEach((oAlbum) => {
            this.oArtistaService.getByAlbum(oAlbum.id).subscribe({
              next: (data: IArtista[]) => {
                this.nombresArtista.set(oAlbum.id, data)
              },
              error: (err) => {
                console.log(err);
              },

            });
            this.oAlbumService.getMedia(oAlbum.id).subscribe({
              next: (data: number) => {
                this.mediasAlbum.set(oAlbum.id, data)
              },
              error: (err) => {
                console.log(err);
              },
            })
            this.oAlbumService.getImg(oAlbum.id).subscribe({
              next: (data) => {
                oAlbum.img = data;
              },
            });

          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getMedia(albumId: number): number {
    return this.mediasAlbum.get(albumId) || 0;
  }
}
