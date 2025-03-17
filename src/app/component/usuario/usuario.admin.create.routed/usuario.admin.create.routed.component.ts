import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';
import { CalendarModule } from 'primeng/calendar';
import { ITipousuario } from '../../../model/tipousuario.iterface';
import { IPage } from '../../../environment/model.interface';
import { TipousuarioService } from '../../../service/tipousuario.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { serverURL } from '../../../environment/environment';
import { BlobToUrlPipe } from '../../../pipe/blob.pipe';

declare let bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-usuario.admin.create.routed',
  templateUrl: './usuario.admin.create.routed.component.html',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    MatSelectModule,
    CalendarModule,
    BlobToUrlPipe,
  ],
  styleUrls: ['./usuario.admin.create.routed.component.css'],
})
export class UsuarioAdminCreateRoutedComponent implements OnInit {
  id: number = 0;
  oUsuarioForm: FormGroup | undefined = undefined;
  oUsuario: IUsuario | null = null;
  strMessage: string = '';

  selected: ITipousuario | null = null;

  myModal: any;

  oPageUsuario: IPage<ITipousuario> | null = null;

  form: FormGroup = new FormGroup({});

  isFileSelected: boolean = false;

  serverURL: string = serverURL;

  constructor(
    private oUsuarioService: UsuarioService,
    private oTipoUsuarioService: TipousuarioService,
    private oRouter: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.oUsuarioForm?.markAllAsTouched();
    this.oTipoUsuarioService.getPage(0, 10, '', '', '').subscribe((oPage) => {
      this.oPageUsuario = oPage;
    });
  }

  createForm() {
    this.oUsuarioForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      fecha: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
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
    this.oUsuarioForm?.controls['username'].setValue('');
    this.oUsuarioForm?.controls['nombre'].setValue('');
    this.oUsuarioForm?.controls['fecha'].setValue('');
    this.oUsuarioForm?.controls['descripcion'].setValue('');
    this.oUsuarioForm?.controls['email'].setValue('');
    this.oUsuarioForm?.controls['password'].setValue('');
    this.oUsuarioForm?.controls['website'].setValue('');
    this.oUsuarioForm?.controls['img'].setValue(null);
    this.oUsuarioForm?.controls['tipousuario'].setValue(null);
  }

  onReset() {
    this.updateForm();
    return false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const blob = new Blob([file], { type: file.type });
      this.oUsuarioForm?.controls['img'].setValue(blob);
      this.isFileSelected = true;
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
    if (this.oUsuarioForm?.invalid) {
      this.showModal('Formulario inválido');
      return;
    } else {
      this.oUsuarioService.create(this.oUsuarioForm?.value).subscribe({
        next: (oUsuario: IUsuario) => {
          this.oUsuario = oUsuario;
          this.showModal('Usuario creado con el id: ' + this.oUsuario.id);
        },
        error: (err) => {
          this.showModal('Error al crear el usuario');
          console.log(err);
        },
      });
    }
  }
}
