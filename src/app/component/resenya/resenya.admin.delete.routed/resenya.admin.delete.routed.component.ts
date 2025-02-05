import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResenyaService } from '../../../service/resenya.service';
import { IResenya } from '../../../model/resenya.interface';

declare let bootstrap: any;

@Component({
  selector: 'app-resenya.admin.delete.routed',
  templateUrl: './resenya.admin.delete.routed.component.html',
  standalone: true,
  imports: [RouterModule],
  styleUrls: ['./resenya.admin.delete.routed.component.css'],
})
export class ResenyaAdminDeleteRoutedComponent implements OnInit {
  //
  id: number = 0;
  oResenya: IResenya = {} as IResenya;

  strMessage: string = '';

  myModal: any;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oResenyaService: ResenyaService,
    private oRouter: Router
  ) {}

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.oResenyaService.get(this.id).subscribe({
      next: (data: IResenya) => {
        this.oResenya = data;
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
    this.oResenyaService.delete(this.oResenya!.id).subscribe({
      next: (data) => {
        this.showModal(
          'La Resenya con id ' + this.oResenya!.id + ' ha sido borrado'
        );
      },
      error: (error) => {
        this.showModal('Error al borrar la resenya');
      },
    });
  }

  cancel(): void {
    this.oRouter.navigate(['/admin/resenya/plist']);
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/resenya/plist']);
  };
}
