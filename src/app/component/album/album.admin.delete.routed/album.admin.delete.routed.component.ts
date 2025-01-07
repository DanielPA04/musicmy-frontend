import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlbumService } from '../../../service/album.service';
import { IAlbum } from '../../../model/album.interface';
import { HttpErrorResponse } from '@angular/common/http';

declare let bootstrap: any;

@Component({
  selector: 'app-album.admin.delete.routed',
  templateUrl: './album.admin.delete.routed.component.html',
  standalone: true,
  imports: [RouterModule],
  styleUrls: ['./album.admin.delete.routed.component.css'],
})
export class AlbumAdminDeleteRoutedComponent implements OnInit {
  //
  id: number = 0;
  oAlbum: IAlbum = {} as IAlbum;

  strMessage: string = '';

  myModal: any;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oAlbumService: AlbumService,
    private oRouter: Router
  ) {}

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.oAlbumService.get(this.id).subscribe({
      next: (data: IAlbum) => {
        this.oAlbum = data;
      },
    });
  }


  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  delete(): void {
    this.oAlbumService.delete(this.oAlbum!.id).subscribe({
      next: (data) => {
        this.showModal(
          'El Album con id ' + this.oAlbum!.id + ' ha sido borrado'
        );
      },
      error: (error) => {
        this.showModal('Error al borrar el album');
      },
    });
  }

  cancel(): void {
    this.oRouter.navigate(['/admin/album/plist']);
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/album/plist']);
  };
}
