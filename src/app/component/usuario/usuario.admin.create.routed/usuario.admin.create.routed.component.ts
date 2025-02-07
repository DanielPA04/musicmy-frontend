import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ArtistaService } from '../../../service/artista.service';
import { IArtista } from '../../../model/artista.interface';

declare let bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-usuario.admin.create.routed',
  templateUrl: './usuario.admin.create.routed.component.html',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  styleUrls: ['./usuario.admin.create.routed.component.css'],
})
export class UsuarioAdminCreateRoutedComponent implements OnInit {
  id: number = 0;
  oArtistaForm: FormGroup | undefined = undefined;
  oArtista: IArtista | null = null;
  strMessage: string = '';

  myModal: any;

  form: FormGroup = new FormGroup({});


  constructor(
    private oArtistaService: ArtistaService,
    private oRouter: Router,
  ) {}

  ngOnInit() {
    this.createForm();
    this.oArtistaForm?.markAllAsTouched();
  }

  createForm() {
    this.oArtistaForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
      ]),
      nombreReal: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(255),
      ]),
      spotify: new FormControl('', [
        Validators.minLength(0),
        Validators.maxLength(255),
      ]),
      img: new FormControl(null),
    });
  }

  updateForm() {
    this.oArtistaForm?.controls['nombre'].setValue('');
    this.oArtistaForm?.controls['nombreReal'].setValue('');
    this.oArtistaForm?.controls['descripcion'].setValue('');
    this.oArtistaForm?.controls['spotify'].setValue('');
    this.oArtistaForm?.controls['img'].setValue(null);
  }

 

  onReset() {
    this.updateForm();
    return false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const blob = new Blob([file], { type: file.type });
      this.oArtistaForm?.controls['img'].setValue(blob);
    }
    console.log(this.oArtistaForm?.value);
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
    this.oRouter.navigate(['/admin/artista/view/' + this.oArtista?.id]);
  };



  onSubmit() {
    if (this.oArtistaForm?.invalid) {
      this.showModal('Formulario inválido');
      return;
    } else {

      

      this.oArtistaService.create(this.oArtistaForm?.value).subscribe({
        next: (oArtista: IArtista) => {
          this.oArtista = oArtista;
          this.showModal('Artista creado con el id: ' + this.oArtista.id);
        },
        error: (err) => {
          this.showModal('Error al crear el artista');
          console.log(err);
        },
      });
    }
  }
}
