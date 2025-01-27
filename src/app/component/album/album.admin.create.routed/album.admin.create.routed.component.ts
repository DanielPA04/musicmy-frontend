import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CALENDAR_ES } from '../../../environment/environment';
import { AlbumService } from '../../../service/album.service';
import { IAlbum } from '../../../model/album.interface';
import { CalendarModule } from 'primeng/calendar';
//import { PrimeNGConfig } from 'primeng/api';

declare let bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-album.admin.create.routed',
  templateUrl: './album.admin.create.routed.component.html',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    CalendarModule,
  ],
  styleUrls: ['./album.admin.create.routed.component.css'],
})
export class AlbumAdminCreateRoutedComponent implements OnInit {
  id: number = 0;
  oAlbumForm: FormGroup | undefined = undefined;
  oAlbum: IAlbum | null = null;
  strMessage: string = '';
  date: string = '';
  myModal: any;



  constructor(
    private oAlbumService: AlbumService,
    private oRouter: Router,
    //private oPrimeconfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.createForm();
    this.oAlbumForm?.markAllAsTouched();
   // this.oPrimeconfig.setTranslation(CALENDAR_ES);
  }

  createForm() {
    this.oAlbumForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
      ]),
      fecha: new FormControl('', [Validators.required]),
      genero: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(255),
      ]),
      descripcion: new FormControl('', [
        Validators.minLength(0),
        Validators.maxLength(255),
      ]),
      discografica: new FormControl('', [
        Validators.required,
        Validators.minLength(0),
        Validators.maxLength(255),
      ]),
      img: new FormControl(null),
    });
  }

  updateForm() {
    this.oAlbumForm?.controls['nombre'].setValue('');
    this.oAlbumForm?.controls['fecha'].setValue('');
    this.oAlbumForm?.controls['genero'].setValue('');
    this.oAlbumForm?.controls['descripcion'].setValue('');
    this.oAlbumForm?.controls['discografica'].setValue('');
    this.oAlbumForm?.controls['img'].setValue(null);
  }

 

  onReset() {
    this.updateForm();
    return false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const blob = new Blob([file], { type: file.type });
      this.oAlbumForm?.controls['img'].setValue(blob);
    }
    console.log(this.oAlbumForm?.value);
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
    this.oRouter.navigate(['/admin/album/view/' + this.oAlbum?.id]);
  };




  onSubmit() {
    if (this.oAlbumForm?.invalid) {
      this.showModal('Formulario inválido');
      return;
    } else {
  

      this.oAlbumService.create(this.oAlbumForm?.value).subscribe({
        next: (oAlbum: IAlbum) => {
          this.oAlbum = oAlbum;
          this.showModal('Album creado con el id: ' + this.oAlbum.id);
        },
        error: (err) => {
          this.showModal('Error al crear el album');
          console.log(err);
        },
      });
    }
  }
}
