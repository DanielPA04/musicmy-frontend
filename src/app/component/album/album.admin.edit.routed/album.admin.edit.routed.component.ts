import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlbumService } from '../../../service/album.service';
import { IAlbum } from '../../../model/album.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CalendarModule } from 'primeng/calendar';
import { BlobToUrlPipe } from '../../../pipe/blob.pipe';
import { ArtistaAdminSelectorUnroutedComponent } from '../../artista/artista.admin.selector.unrouted/artista.admin.selector.unrouted.component';
import { MatDialog } from '@angular/material/dialog';
import { ArtistaService } from '../../../service/artista.service';
import { IArtista } from '../../../model/artista.interface';
import { GrupoalbumartistaService } from '../../../service/grupoalbumartista.service';

declare let bootstrap: any;

@Component({
  selector: 'app-album-admin-edit-routed',
  templateUrl: './album.admin.edit.routed.component.html',
  styleUrls: ['./album.admin.edit.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    CalendarModule,
    BlobToUrlPipe,
  ],
})
export class AlbumAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oAlbumForm: FormGroup | undefined = undefined;
  oAlbum: IAlbum = {} as IAlbum;
  img: Blob = {} as Blob;
  oArtistas: IArtista[] = [];
  strMessage: string = '';
  // TODO mirar que esto quiza no hace falta ni en el create
  isFileSelected: boolean = false;
  myModal: any;
  readonly dialog = inject(MatDialog);

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oAlbumService: AlbumService,
    private oArtistaService: ArtistaService,
    private oGrupoalbumartistaService: GrupoalbumartistaService,
    private oRouter: Router
  ) {
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.createForm();
    this.get();
    this.oAlbumForm?.markAllAsTouched();
  }

  onReset() {
    this.oAlbumService.get(this.id).subscribe({
      next: (oAlbum: IAlbum) => {
        this.oAlbum = oAlbum;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
    return false;
  }

  createForm() {
    this.oAlbumForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
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
    this.oAlbumForm?.controls['id'].setValue(this.oAlbum.id);
    this.oAlbumForm?.controls['nombre'].setValue(this.oAlbum.nombre);
    this.oAlbumForm?.controls['fecha'].setValue(
      this.oAlbum.fecha ? new Date(this.oAlbum.fecha) : null
    );
    this.oAlbumForm?.controls['genero'].setValue(this.oAlbum.genero);
    this.oAlbumForm?.controls['descripcion'].setValue(this.oAlbum.descripcion);
    this.oAlbumForm?.controls['discografica'].setValue(
      this.oAlbum.discografica
    );
    this.oAlbumForm?.controls['img'].setValue(this.oAlbum.img);
    this.oAlbumForm?.controls['artistas'].setValue(this.oArtistas);

  }

  get() {
    this.oAlbumService.get(this.id).subscribe({
      next: (oAlbum: IAlbum) => {
        this.oAlbum = oAlbum;
        this.updateForm();

      },
      error: (error) => {
        console.error(error);
      },
    });
    this.oAlbumService.getImg(this.id).subscribe({
      next: (data) => {
        this.oAlbum!.img = data;
        this.updateForm();

      },
      error: (error) => {
        console.error(error);
      },
    });
    this.oArtistaService.getByAlbum(this.id).subscribe({
      next: (oArtistas: IArtista[]) => {
        this.oArtistas = oArtistas;
        this.updateForm();

      },
      error: (error) => {
        console.error(error);
      },
    })
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
    this.oRouter.navigate(['/admin/album/view/' + this.oAlbum.id]);
  };

  onSubmit() {
    if (!this.oAlbumForm?.valid) {
      this.showModal('Formulario no válido');
      return;
    } else {
      this.oAlbumService.update(this.oAlbumForm?.value).subscribe({
        next: (oAlbum: IAlbum) => {
          this.oAlbum = oAlbum;
          this.oGrupoalbumartistaService.updateArtistasToAlbum(this.oAlbum.id, this.oAlbumForm?.value.artistas).subscribe({
            next: (data) => {
              this.oArtistas = data;
              this.updateForm();
              this.showModal('Album con id ' + this.oAlbum!.id + ' actualizado');

              
            },
            error: (err) => {
              console.log(err);
            },
          })
         
        },
        error: (error) => {
          this.showModal('Error al actualizar el album');
          console.error(error);
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
        this.oAlbumForm?.controls['artistas'].setValue(result);
        console.log(this.oAlbumForm?.value);
      }
    });
    return false;
  }
}
