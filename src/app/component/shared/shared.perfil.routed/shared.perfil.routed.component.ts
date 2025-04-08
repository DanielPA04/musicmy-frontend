import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-shared.perfil.routed',
  templateUrl: './shared.perfil.routed.component.html',
  styleUrls: ['./shared.perfil.routed.component.css'],
    imports: [CommonModule],
  
})
export class SharedPerfilRoutedComponent implements OnInit {
  email: string = '';
  usuario: IUsuario | null = null;
  
  // paginacion Resenya
  oPage: IPage<IResenya> | null = null;
  arrBotonera: string[] = [];  
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 2;
  //
  strField: string = '';
  strDir: string = '';
  strFiltro: string = '';

  nombresAlbumes: Map<number, IAlbum> = new Map<number, IAlbum>();
  nombresArtista: Map<number, IArtista[]> = new Map<number, IArtista[]>();
  mediasArtista: Map<number, number> = new Map<number, number>();

  serverURL: string = serverURL;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oUsuarioService: UsuarioService,
    private oArtistaService: ArtistaService,
    private oAlbumService: AlbumService,
    private oResenyaService: ResenyaService,
    private oBotoneraService: BotoneraService
  ) {
    this.email = this.oActivatedRoute.snapshot.params['email'];
  }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
  this.oUsuarioService
    .getUsuarioByEmail(this.email)
    .subscribe((data: IUsuario) => {
      this.usuario = data;
      this.oResenyaService
        .getPageByUsuario(data.id, this.nPage, this.nRpp, this.strField, this.strDir)
        .subscribe({
          next: (data: IPage<IResenya>) => {
            this.oPage = data;
            this.arrBotonera = this.oBotoneraService.getBotonera(
              this.nPage,
              data.totalPages
            );


            this.oPage.content.forEach((oResenya) => {

              
              this.oArtistaService.getByAlbum(oResenya.album.id).subscribe({
                next: (artistas: IArtista[]) => {
                  this.nombresArtista.set(oResenya.album.id, artistas);
                },
              });

            

            });
          },
        });
    });
}

  getMedia(albumId: number): number {
    return this.mediasArtista.get(albumId) || 0;
  }

  goToPage(p: number) {
    if (p) {
      this.nPage = p - 1;
      this.getPage();
    }
    return false;
  }

  goToNext() {
    this.nPage++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.nPage--;
    this.getPage();
    return false;
  }
}
