import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ResenyaService } from '../../../service/resenya.service';
import { IResenya } from '../../../model/resenya.interface';

declare let bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-resenya.admin.create.routed',
  templateUrl: './resenya.admin.create.routed.component.html',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  styleUrls: ['./resenya.admin.create.routed.component.css'],
})
export class ResenyaAdminCreateRoutedComponent implements OnInit {
  id: number = 0;
  oResenyaForm: FormGroup | undefined = undefined;
  oResenya: IResenya | null = null;
  strMessage: string = '';

  myModal: any;

  form: FormGroup = new FormGroup({});


  constructor(
    private oResenyaService: ResenyaService,
    private oRouter: Router,
  ) { }

  ngOnInit() {
    this.createForm();
    this.oResenyaForm?.markAllAsTouched();
  }

  createForm() {
    this.oResenyaForm = new FormGroup({
      nota: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      fecha: new FormControl(Date.now()),
      website: new FormControl(''),
      album: new FormControl('', [Validators.required]),
      usuario: new FormControl('', [Validators.required]),

    });
  }

  updateForm() {
    this.oResenyaForm?.controls['nota'].setValue('');
    this.oResenyaForm?.controls['descripcion'].setValue('');
    this.oResenyaForm?.controls['fecha'].setValue(Date.now());
    this.oResenyaForm?.controls['website'].setValue('');
    this.oResenyaForm?.controls['album'].setValue('');
    this.oResenyaForm?.controls['usuario'].setValue('');

  }



  onReset() {
    this.updateForm();
    return false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const blob = new Blob([file], { type: file.type });
      this.oResenyaForm?.controls['img'].setValue(blob);
    }
    console.log(this.oResenyaForm?.value);
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
    this.oRouter.navigate(['/admin/resenya/view/' + this.oResenya?.id]);
  };



  onSubmit() {
    if (this.oResenyaForm?.invalid) {
      this.showModal('Formulario inválido');
      return;
    } else {



      this.oResenyaService.create(this.oResenyaForm?.value).subscribe({
        next: (oResenya: IResenya) => {
          this.oResenya = oResenya;
          this.showModal('Resenya creado con el id: ' + this.oResenya.id);
        },
        error: (err) => {
          this.showModal('Error al crear el resenya');
          console.log(err);
        },
      });
    }
  }
}
