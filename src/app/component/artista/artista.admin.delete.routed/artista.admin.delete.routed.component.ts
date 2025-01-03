import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArtistaService } from '../../../service/artista.service';
import { IArtista } from '../../../model/artista.interface';
import { HttpErrorResponse } from '@angular/common/http';

declare let bootstrap: any;

@Component({
  selector: 'app-artista.admin.delete.routed',
  templateUrl: './artista.admin.delete.routed.component.html',
  standalone: true,
  imports: [RouterModule],
  styleUrls: ['./artista.admin.delete.routed.component.css'],
})
export class ArtistaAdminDeleteRoutedComponent implements OnInit {
  //
  id: number = 0;
  oArtista: IArtista = {} as IArtista;

  strMessage: string = '';

  myModal: any;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oArtistaService: ArtistaService,
    private oRouter: Router
  ) {}

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.oArtistaService.getOne(this.id).subscribe({
      next: (data: IArtista) => {
        this.oArtista = data;
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
    this.oArtistaService.delete(this.oArtista!.id).subscribe({
      next: (data) => {
        this.showModal(
          'El Artista con id ' + this.oArtista!.id + ' ha sido borrado'
        );
      },
      error: (error) => {
        this.showModal('Error al borrar el artista');
      },
    });
  }

  cancel(): void {
    this.oRouter.navigate(['/admin/artista/plist']);
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/artista/plist']);
  };
}
