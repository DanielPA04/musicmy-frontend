import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../service/album.service';
import { IPage } from '../../../environment/model.interface';
import { IAlbum } from '../../../model/album.interface';
import { BlobToUrlPipe } from '../../../pipe/blob.pipe';
import { ArtistaService } from '../../../service/artista.service';
import { IArtista } from '../../../model/artista.interface';
import { SessionService } from '../../../service/session.service';
import { ActivatedRoute } from '@angular/router';
import { ResenyaService } from '../../../service/resenya.service';
import { UsuarioService } from '../../../service/usuario.service';
import { IResenya } from '../../../model/resenya.interface';
import { serverURL } from '../../../environment/environment';

@Component({
  selector: 'app-album.usuario.view.routed',
  templateUrl: './album.usuario.view.routed.component.html',
  styleUrls: ['./album.usuario.view.routed.component.css'],
  providers: [AlbumService, ArtistaService],
  imports: [BlobToUrlPipe]  
})
export class AlbumUsuarioViewRoutedComponent implements OnInit {
  album : IAlbum | null = null;
  artistas: IArtista[] = [];
  media: number = 0;
  resenyas: IPage<IResenya> = {} as IPage<IResenya>
  email: string = '';
  id: number = 0;
  activeSession: boolean = false;
  isResenyaExist: boolean = true;
  serverURL: string = serverURL;

  constructor(
    private oAlbumService: AlbumService,
    private oArtistaService: ArtistaService,
    private oUsuarioService: UsuarioService,
    private oSessionService: SessionService,
    private oResenyaService: ResenyaService,
    private oActivedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.oActivedRoute.snapshot.params['id'];
    this.activeSession = this.oSessionService.isSessionActive();
    this.email = this.oSessionService.getSessionEmail();
    this.get();
  }

  get() {
    this.oAlbumService.get(this.id).subscribe({
      next: (album : IAlbum) => {
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

          this.oResenyaService.checkIfResenyaExistsByEmailAndAlbumId(this.email, album.id).subscribe({
            next: (data: boolean) => {
              this.isResenyaExist = data;
            },
            error: (err) => {
              console.log(err);
            }
            
          });


          this.oResenyaService.getPageByAlbum(album.id, 0, 10, '', '').subscribe({
            next: (data: IPage<IResenya>) => {
              this.resenyas = data;
            },
            error: (err) => {
              console.log(err);
            },
          })
       
      },
      error: (err) => {
        console.log(err);
      },
      
   
    });
  }


}
