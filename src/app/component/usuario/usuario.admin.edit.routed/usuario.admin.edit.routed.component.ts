import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CalendarModule } from 'primeng/calendar';
import { IPage } from '../../../environment/model.interface';
import { ITipousuario } from '../../../model/tipousuario.iterface';
import { TipousuarioService } from '../../../service/tipousuario.service';

declare let bootstrap: any;

@Component({
  selector: 'app-usuario-admin-edit-routed',
  templateUrl: './usuario.admin.edit.routed.component.html',
  styleUrls: ['./usuario.admin.edit.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    MatSelectModule,
    CalendarModule,
  ],
})
export class UsuarioAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oUsuarioForm: FormGroup | undefined = undefined;
  oUsuario: IUsuario | null = null;
  strMessage: string = '';
  oPageUsuario: IPage<ITipousuario> | null = null;
  selected: ITipousuario | null = null;
  myModal: any;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oUsuarioService: UsuarioService,
    private oTipoUsuarioService: TipousuarioService,
    private oRouter: Router
  ) {
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.createForm();
    this.oTipoUsuarioService.getPage(0, 10, "", "", "").subscribe((oPage) => {
      this.oPageUsuario = oPage;
      this.get();

    });
    this.oUsuarioForm?.markAllAsTouched();

  }


  onReset() {
    this.oUsuarioService.get(this.id).subscribe({
      next: (oUsuario: IUsuario) => {
        this.oUsuario = oUsuario;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
    return false;
  }

  createForm() {
    this.oUsuarioForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      fecha: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.minLength(5),
        Validators.maxLength(255),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
      ]),
      website: new FormControl(''),
      img: new FormControl(null),
      tipousuario: new FormControl([], [Validators.required]),
    });
  }


  updateForm() {
    if (!this.oUsuario) return;
    this.oUsuarioForm?.patchValue({
      id: this.oUsuario.id,
      nombre: this.oUsuario.nombre,
      fecha: this.oUsuario.fecha,
      descripcion: this.oUsuario.descripcion,
      email: this.oUsuario.email,
      password: this.oUsuario.password,
      website: this.oUsuario.website,
      img: this.oUsuario.img,
    });
    if (this.oPageUsuario?.content) {
      const matchedTipoUsuario = this.oPageUsuario.content.find(
        (tipo) => tipo.id === this.oUsuario?.tipousuario?.id
      );
      this.oUsuarioForm?.controls['tipousuario'].setValue(matchedTipoUsuario || null);
    }
  }

  get() {
    this.oUsuarioService.get(this.id).subscribe({
      next: (oUsuario: IUsuario) => {
        this.oUsuario = oUsuario;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const blob = new Blob([file], { type: file.type });
      this.oUsuarioForm?.controls['img'].setValue(blob);
    }
    console.log(this.oUsuarioForm?.value);
  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/usuario/view/' + this.oUsuario?.id]);
  };

  onSubmit() {
    if (!this.oUsuarioForm?.valid) {
      this.showModal('Formulario no válido');
      return;
    } else {
      this.oUsuarioService.update(this.oUsuarioForm?.value).subscribe({
        next: (oUsuario: IUsuario) => {
          this.oUsuario = oUsuario;
          this.updateForm();
          this.showModal('usuario ' + this.oUsuario.id + ' actualizado');
        },
        error: (error) => {
          this.showModal('Error al actualizar el usuario');
          console.error(error);
        },
      });
    }
  }
}
