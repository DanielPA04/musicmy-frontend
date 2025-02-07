import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';

declare let bootstrap: any;

@Component({
  selector: 'app-usuario.admin.delete.routed',
  templateUrl: './usuario.admin.delete.routed.component.html',
  standalone: true,
  imports: [RouterModule],
  styleUrls: ['./usuario.admin.delete.routed.component.css'],
})
export class UsuarioAdminDeleteRoutedComponent implements OnInit {
  //
  id: number = 0;
  oUsuario: IUsuario = {} as IUsuario;

  strMessage: string = '';

  myModal: any;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oUsuarioService: UsuarioService,
    private oRouter: Router
  ) {}

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.oUsuarioService.get(this.id).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;
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
    this.oUsuarioService.delete(this.oUsuario!.id).subscribe({
      next: (data) => {
        this.showModal(
          'El Usuario con id ' + this.oUsuario!.id + ' ha sido borrado'
        );
      },
      error: (error) => {
        this.showModal('Error al borrar el usuario');
      },
    });
  }

  cancel(): void {
    this.oRouter.navigate(['/admin/usuario/plist']);
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/usuario/plist']);
  };
}
