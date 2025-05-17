import { Component, OnInit } from '@angular/core';
import { ArtistaService } from '../../../service/artista.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IArtista } from '../../../model/artista.interface';
import { serverURL } from '../../../environment/environment';
import { IAlbum } from '../../../model/album.interface';
import { AlbumService } from '../../../service/album.service';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-artista-usuario-view-routed',
  templateUrl: './artista.usuario.view.routed.component.html',
  styleUrls: ['./artista.usuario.view.routed.component.css'],
  imports: [NgClass, CommonModule, RouterLink],
  standalone: true,
})
export class ArtistaUsuarioViewRoutedComponent implements OnInit {
  id: number = 0;
  serverURL: string = serverURL;
  oArtista: IArtista = {} as IArtista;
  oAlbumes: IAlbum[] = [];
    mediasAlbum: Map<number, number> = new Map<number, number>()

  constructor(
    private oArtistaService: ArtistaService,
    private oActivatedRoute: ActivatedRoute,
    private oAlbumService: AlbumService
  ) {}

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getArtista();
    this.getAlbumes();
  }

  getArtista() {
    this.oArtistaService.get(this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.oArtista = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getAlbumes() {
    this.oAlbumService.getByArtista(this.id).subscribe({
      next: (data) => {
        console.log(data);
        this.oAlbumes = data;
        this.getMediasAlbumes();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getMediasAlbumes() {
    this.oAlbumes.forEach((album) => {
      this.oAlbumService.getMedia(album.id).subscribe({
        next: (data) => {
          console.log(data);
          this.mediasAlbum.set(album.id, data);
        },
        error: (error) => {
          console.error(error);
        },
      });
    });
  }

   getMedia(albumId: number): number {
    return this.mediasAlbum.get(albumId) || 0;
  }
}
