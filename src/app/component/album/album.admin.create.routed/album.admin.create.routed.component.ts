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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CALENDAR_ES } from '../../../environment/environment';
import { AlbumService } from '../../../service/album.service';
import { IAlbum } from '../../../model/album.interface';

declare let bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-album.admin.create.routed',
  templateUrl: './album.admin.create.routed.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCheckboxModule,
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
  checkboxValue: number = 0;  // Inicia con 0

  myModal: any;

  form: FormGroup = new FormGroup({});

  constructor(
    private oAlbumService: AlbumService,
    private oRouter: Router,
    private oPrimeconfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.createForm();
    this.oAlbumForm?.markAllAsTouched();
    this.oPrimeconfig.setTranslation(CALENDAR_ES);
  }

  createForm() {
    this.oAlbumForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(255),
      ]),
      comentarios: new FormControl('', [
        Validators.minLength(0),
        Validators.maxLength(255),
      ]),
      inventariable: new FormControl(''),
      momentstamp: new FormControl('', [
        Validators.required
      ]),
      id_tipoasiento: new FormControl('',[Validators.required]),
      id_usuario: new FormControl('',[Validators.required]),
      id_periodo: new FormControl('',[Validators.required]),

    });
  }

  updateForm() {
    this.oAlbumForm?.controls['descripcion'].setValue('');
    this.oAlbumForm?.controls['comentarios'].setValue('');
    this.oAlbumForm?.controls['inventariable'].setValue('');
    this.oAlbumForm?.controls['momentstamp'].setValue('');
    this.oAlbumForm?.controls['id_tipoasiento'].setValue('');
    this.oAlbumForm?.controls['id_usuario'].setValue('');
    this.oAlbumForm?.controls['id_periodo'].setValue('');
  }

  onCheckboxChange(event: any): void {
    this.checkboxValue = event.checked ? 1 : 0;
  }

  onReset() {
    this.updateForm();
    return false;
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
  }

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
