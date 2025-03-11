import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumService } from "../../../service/album.service";
import { IPage } from "../../../environment/model.interface";
import { IAlbum } from "../../../model/album.interface";
import { ArtistaService } from "../../../service/artista.service";
import { IArtista } from '../../../model/artista.interface';
import { serverURL } from "../../../environment/environment";
import { SessionService } from "../../../service/session.service";

@Component({
  selector: 'app-shared-home-routed',
  templateUrl: './shared.home.routed.component.html',
  styleUrls: ['./shared.home.routed.component.css'],
  standalone: true,
  imports: [CommonModule]
})

export class SharedHomeRoutedComponent implements OnInit {
  oPage: IPage<IAlbum> = {} as IPage<IAlbum>
  oPageLastMonth: IPage<IAlbum> = {} as IPage<IAlbum>
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
    this.getPage()
    this.getPageLastMonth()
  }

  getPageLastMonth() {
    this.oAlbumService
      .getPageLastMonth(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
      )
      .subscribe({
        next: (oPageFromServer: IPage<IAlbum>) => {
          this.oPageLastMonth = oPageFromServer;
          
          this.oPageLastMonth.content.forEach((oAlbum) => {
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

  getPage() {
    this.oAlbumService
      .getPage(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro
      )
      .subscribe({
        next: (oPageFromServer: IPage<IAlbum>) => {
          this.oPage = oPageFromServer;
          // this.arrBotonera = this.oBotoneraService.getBotonera(
          //   this.nPage,
          //   oPageFromServer.totalPages
          // );
          this.oPage.content.forEach((oAlbum) => {
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

  getMedia(albumId: number): number {
    return this.mediasAlbum.get(albumId) || 0;
  }
}
