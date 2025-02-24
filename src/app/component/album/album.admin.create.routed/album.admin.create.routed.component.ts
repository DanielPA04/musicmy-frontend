import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlbumService } from '../../../service/album.service';
import { IAlbum } from '../../../model/album.interface';
import { CalendarModule } from 'primeng/calendar';
import { BlobToUrlPipe } from '../../../pipe/blob.pipe';
import { MatDialog } from '@angular/material/dialog';
import { IArtista } from '../../../model/artista.interface';
import { ArtistaAdminSelectorUnroutedComponent } from '../../artista/artista.admin.selector.unrouted/artista.admin.selector.unrouted.component';
import { GrupoalbumartistaService } from '../../../service/grupoalbumartista.service';
import { PrimeNGConfig } from 'primeng/api';
import { CALENDAR_ES } from '../../../environment/environment';

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
    BlobToUrlPipe,
  ],
  styleUrls: ['./album.admin.create.routed.component.css'],
})
export class AlbumAdminCreateRoutedComponent implements OnInit {
  id: number = 0;
  oAlbumForm: FormGroup | undefined = undefined;
  oAlbum: IAlbum | null = null;
  oArtistas: IArtista[] = [];
  strMessage: string = '';
  date: string = '';
  myModal: any;
  readonly dialog = inject(MatDialog);
  isFileSelected: boolean = false;



  constructor(
    private oAlbumService: AlbumService,
    private oRouter: Router,
    private oGrupoalbumartistaService: GrupoalbumartistaService,
    private oPrimeconfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.createForm();
    this.oAlbumForm?.markAllAsTouched();
   this.oPrimeconfig.setTranslation(CALENDAR_ES);
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
      artistas: new FormControl([]),
    });
  }

  updateForm() {
    this.oAlbumForm?.controls['nombre'].setValue('');
    this.oAlbumForm?.controls['fecha'].setValue('');
    this.oAlbumForm?.controls['genero'].setValue('');
    this.oAlbumForm?.controls['descripcion'].setValue('');
    this.oAlbumForm?.controls['discografica'].setValue('');
    this.oAlbumForm?.controls['img'].setValue(null);
    this.oAlbumForm?.controls['artistas'].setValue(null);
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
      this.isFileSelected = true;
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
          this.oGrupoalbumartistaService.updateArtistasToAlbum(this.oAlbum.id, this.oAlbumForm?.value.artistas).subscribe({
            next: (data) => {
              console.log(data);
              this.showModal('Album con id ' + this.oAlbum!.id + ' creado');
            },
            error: (err) => {
              console.log(err);
            },
            
          })

        },
        error: (err) => {
          this.showModal('Error al crear el album');
          console.log(err);
        },
      });
    }
  }

  showArtistaSelectorModal() {
    const dialogRef = this.dialog.open(ArtistaAdminSelectorUnroutedComponent, {
      height: '800px',
      maxHeight: '1200px',
      width: '80%',
      maxWidth: '90%',
      data: this.oAlbumForm?.value.artistas

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);
        this.oAlbumForm?.controls['artistas'].setValue(result);
        console.log(this.oAlbumForm?.value);
      }
    });
    return false;
  }


}
