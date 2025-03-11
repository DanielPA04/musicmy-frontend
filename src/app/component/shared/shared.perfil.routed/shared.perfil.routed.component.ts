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

@Component({
  selector: 'app-shared.perfil.routed',
  templateUrl: './shared.perfil.routed.component.html',
  styleUrls: ['./shared.perfil.routed.component.css'],
})
export class SharedPerfilRoutedComponent implements OnInit {
  email: string = '';
  usuario: IUsuario = {} as IUsuario;
  pageResenya: IPage<IResenya> | null = null;
  arrBotoneraResenya: string[] = [];
  nPage: number = 0; // 0-based server count
  nombresAlbumes: Map<number, IAlbum> = new Map<number, IAlbum>();
  nombresArtista: Map<number, IArtista[]> = new Map<number, IArtista[]>();
  mediasArtista: Map<number, number> = new Map<number, number>()
  serverURL: string = serverURL
  

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oUsuarioService: UsuarioService,
    private oArtistaService: ArtistaService,
    private oAlbumService: AlbumService,
    private oResenyaService: ResenyaService,
    private oBotoneraService: BotoneraService
  ) {
    this.email = this.oActivatedRoute.snapshot.params['email'];
    this.oUsuarioService
      .getUsuarioByEmail(this.email)
      .subscribe((data: IUsuario) => {
        this.usuario = data;
        this.oResenyaService
          .getPageByUsuario(data.id, 0, 10, '', '', '')
          .subscribe({
            next: (data: IPage<IResenya>) => {
              this.pageResenya = data;
              this.arrBotoneraResenya = this.oBotoneraService.getBotonera(
                this.nPage,
                data.totalPages
              );

              this.pageResenya.content.forEach((oResenya) => {
                this.oAlbumService.get(oResenya.album.id).subscribe({
                  next: (album: IAlbum) => {
                    this.nombresAlbumes.set(oResenya.album.id, album);
                  },
                });
              });
            },
          });
      });
  }

  ngOnInit() {}

  getMedia(albumId: number): number {
    return this.mediasArtista.get(albumId) || 0;
  }
}
