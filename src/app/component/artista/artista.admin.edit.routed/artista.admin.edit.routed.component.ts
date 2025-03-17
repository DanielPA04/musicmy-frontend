import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArtistaService } from '../../../service/artista.service';
import { IArtista } from '../../../model/artista.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BlobToUrlPipe } from '../../../pipe/blob.pipe';
import { MatDialog } from '@angular/material/dialog';
import { AlbumAdminMulselectorUnroutedComponent } from '../../album/album.admin.mulselector.unrouted/album.admin.mulselector.unrouted.component';
import { IAlbum } from '../../../model/album.interface';
import { AlbumService } from '../../../service/album.service';
import { GrupoalbumartistaService } from '../../../service/grupoalbumartista.service';

declare let bootstrap: any;

@Component({
  selector: 'app-artista-admin-edit-routed',
  templateUrl: './artista.admin.edit.routed.component.html',
  styleUrls: ['./artista.admin.edit.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    BlobToUrlPipe,
  ],
})
export class ArtistaAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oArtistaForm: FormGroup | undefined = undefined;
  oArtista: IArtista | null = null;
  strMessage: string = '';

  oAlbum: IAlbum[] = [];


  myModal: any;

  readonly dialog = inject(MatDialog);

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oArtistaService: ArtistaService,
    private oAlbumService: AlbumService,
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
    this.oArtistaForm?.markAllAsTouched();
  }

  onReset() {
    this.oArtistaService.get(this.id).subscribe({
      next: (oArtista: IArtista) => {
        this.oArtista = oArtista;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
    return false;
  }

  createForm() {
    this.oArtistaForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
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
      albumes: new FormControl([]),
    });
  }

  updateForm() {
    this.oArtistaForm?.controls['id'].setValue(this.oArtista?.id);
    this.oArtistaForm?.controls['nombre'].setValue(this.oArtista?.nombre);
    this.oArtistaForm?.controls['nombreReal'].setValue(
      this.oArtista?.nombrereal
    );
    this.oArtistaForm?.controls['descripcion'].setValue(
      this.oArtista?.descripcion
    );
    this.oArtistaForm?.controls['spotify'].setValue(this.oArtista?.spotify);
    this.oArtistaForm?.controls['img'].setValue(null);
    this.oArtistaForm?.controls['albumes'].setValue(this.oAlbum);

  }

  get() {
    this.oArtistaService.get(this.id).subscribe({
      next: (oArtista: IArtista) => {
        this.oArtista = oArtista;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.oAlbumService.getByArtista(this.id).subscribe({
      next: (oAlbum: IAlbum[]) => {
        this.oAlbum = oAlbum;
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
    if (!this.oArtistaForm?.valid) {
      this.showModal('Formulario no válido');
      return;
    } else {
      this.oArtistaService.update(this.oArtistaForm?.value).subscribe({
        next: (oArtista: IArtista) => {
          this.oArtista = oArtista;
          this.oGrupoalbumartistaService.updateAlbumesToArtista(this.oArtista.id, this.oArtistaForm?.value.albumes).subscribe({
            next: (data) => {
              console.log(data);
              this.showModal('Artista actualizado con el id: ' + this.oArtista?.id);
            },
            error: (err) => {
              console.error(err);
            }
          })
        },
        error: (error) => {
          this.showModal('Error al actualizar el artista');
          console.error(error);
        },
      });
    }
  }

  showAlbumSelectorModal() {
    const dialogRef = this.dialog.open(AlbumAdminMulselectorUnroutedComponent, {
          height: '800px',
          maxHeight: '1200px',
          width: '80%',
          maxWidth: '90%',
          data: this.oArtistaForm?.value.albumes
    
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          if (result !== undefined) {
            console.log(result);
            this.oArtistaForm?.controls['albumes'].setValue(result);
            console.log(this.oArtistaForm?.value);
          }
        });
        return false;
  }
}
