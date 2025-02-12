import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';
import { HttpErrorResponse } from '@angular/common/http';

declare let bootstrap: any;

@Component({
  selector: 'app-usuario.admin.view.routed',
  templateUrl: './usuario.admin.view.routed.component.html',
  standalone: true,
  styleUrls: ['./usuario.admin.view.routed.component.css'],
})
export class UsuarioAdminViewRoutedComponent implements OnInit, AfterViewInit {
  //
  id: number = 0;
  oUsuario: IUsuario | null = null;
  //
  myModal: any;
  strMessage: string = '';

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oUsuarioService: UsuarioService
  ) {}

  ngOnInit(): void {

    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.oUsuarioService.get(this.id).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;
      },
      error: (error: HttpErrorResponse) => {
        console.log("error");
        console.log(error.error.message);
        this.showModal(error.error.message);
      },
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const modalElement = document.getElementById('mimodal');
      if (!modalElement) {
        console.error('El modal sigue sin estar en el DOM');
      }
    }, 500); // Pequeño retraso para asegurar que el DOM se cargue
  }


  showModal(mensaje: string) {
    this.strMessage = mensaje;
    
    setTimeout(() => {
      const modalElement = document.getElementById('mimodal');
      if (!modalElement) {
        console.error('El modal sigue sin estar en el DOM');
        return;
      }
      this.myModal = new bootstrap.Modal(modalElement, { keyboard: false });
      this.myModal.show();
    }, 100); // Retraso de 100ms para asegurarse de que el DOM ha cargado
  }

  hideModal = () => {
    this.myModal.hide();
    // this.oRouter.navigate(['/admin/usuario/view/' + this.oUsuario?.id]);
  };
}
