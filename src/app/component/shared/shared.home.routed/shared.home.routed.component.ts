import { Component, OnInit } from "@angular/core";
import { AlbumService } from "../../../service/album.service";
import { IPage } from "../../../environment/model.interface";
import { IAlbum } from "../../../model/album.interface";
import { BlobToUrlPipe } from "../../../pipe/blob.pipe";
import { ArtistaService } from "../../../service/artista.service";
import { IArtista } from '../../../model/artista.interface';
import { SessionService } from "../../../service/session.service";

@Component({
  selector: 'app-shared-home-routed',
  templateUrl: './shared.home.routed.component.html',
  styleUrls: ['./shared.home.routed.component.css'],
  imports: [BlobToUrlPipe],
  standalone: true
})

export class SharedHomeRoutedComponent implements OnInit {
  oPage: IPage<IAlbum> = {} as IPage<IAlbum>
  oPageLastMonth: IPage<IAlbum> = {} as IPage<IAlbum>
  nombresArtista: Map<number, IArtista[]> = new Map<number, IArtista[]>()
  mediasArtista: Map<number, number> = new Map<number, number>()
  nPage: number = 0
  nRpp: number = 8
  strField: string = ''
  strDir: string = ''
  strFiltro: string = ''

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
          // this.arrBotonera = this.oBotoneraService.getBotonera(
          //   this.nPage,
          //   oPageFromServer.totalPages
          // );



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
                this.mediasArtista.set(oAlbum.id, data)
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
                this.mediasArtista.set(oAlbum.id, data)
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


  // In your component class
getMedia(albumId: number): number {
  return this.mediasArtista.get(albumId) ?? 0;
}



}
