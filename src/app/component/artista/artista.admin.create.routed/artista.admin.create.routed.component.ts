import { Component, inject, OnInit } from '@angular/core';
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
import { BlobToUrlPipe } from '../../../pipe/blob.pipe';
import { IAlbum } from '../../../model/album.interface';
import { MatDialog } from '@angular/material/dialog';
import { AlbumAdminSelectorUnroutedComponent } from '../../album/album.admin.selector.unrouted/album.admin.selector.unrouted.component';
import { AlbumAdminMulselectorUnroutedComponent } from '../../album/album.admin.mulselector.unrouted/album.admin.mulselector.unrouted.component';
import { GrupoalbumartistaService } from '../../../service/grupoalbumartista.service';

declare let bootstrap: any;

@Component({
  standalone: true,
  selector: 'app-artista.admin.create.routed',
  templateUrl: './artista.admin.create.routed.component.html',
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
    BlobToUrlPipe,
  ],
  styleUrls: ['./artista.admin.create.routed.component.css'],
})
export class ArtistaAdminCreateRoutedComponent implements OnInit {
  id: number = 0;
  oArtistaForm: FormGroup | undefined = undefined;
  oArtista: IArtista | null = null;
  strMessage: string = '';
  readonly dialog = inject(MatDialog);

  myModal: any;

  form: FormGroup = new FormGroup({});


  constructor(
    private oArtistaService: ArtistaService,
    private oGrupoalbumartistaService: GrupoalbumartistaService,
    private oRouter: Router,
  ) { }

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
      albumes: new FormControl([]),
    });
  }

  updateForm() {
    this.oArtistaForm?.controls['nombre'].setValue('');
    this.oArtistaForm?.controls['nombreReal'].setValue('');
    this.oArtistaForm?.controls['descripcion'].setValue('');
    this.oArtistaForm?.controls['spotify'].setValue('');
    this.oArtistaForm?.controls['img'].setValue(null);
    this.oArtistaForm?.controls['albumes'].setValue(null);

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
          this.oGrupoalbumartistaService.updateAlbumesToArtista(this.oArtista.id, this.oArtistaForm?.value.albumes).subscribe({
            next: (data) => {
              console.log(data);
              this.showModal('Artista creado con el id: ' + this.oArtista?.id);
            },
            error: (err) => {
              console.log(err);
            },
          })
        },
        error: (err) => {
          this.showModal('Error al crear el artista');
          console.log(err);
        },
      });
    }
  }


  showAlbumSelectorModal() {
    console.log(this.oArtistaForm?.value.artistas);
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
