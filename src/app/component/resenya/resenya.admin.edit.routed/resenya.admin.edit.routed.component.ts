import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResenyaService } from '../../../service/resenya.service';
import { IResenya } from '../../../model/resenya.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsuarioAdminSelectorUnroutedComponent } from '../../usuario/usuario.admin.selector.unrouted/usuario.admin.selector.unrouted.component';
import { MatDialog } from '@angular/material/dialog';
import { AlbumAdminSelectorUnroutedComponent } from '../../album/album.admin.selector.unrouted/album.admin.selector.unrouted.component';
import { AlbumService } from '../../../service/album.service';
import { UsuarioService } from '../../../service/usuario.service';
import { IAlbum } from '../../../model/album.interface';
import { IUsuario } from '../../../model/usuario.interface';

declare let bootstrap: any;

@Component({
  selector: 'app-resenya-admin-edit-routed',
  templateUrl: './resenya.admin.edit.routed.component.html',
  styleUrls: ['./resenya.admin.edit.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class ResenyaAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oResenyaForm: FormGroup | undefined = undefined;
  oResenya: IResenya | null = null;
  strMessage: string = '';
  myModal: any;
  readonly dialog = inject(MatDialog);

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oResenyaService: ResenyaService,
    private oRouter: Router,
    private oAlbumService: AlbumService,
    private oUsuarioService: UsuarioService
  ) {
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.createForm();
    this.get();
    this.oResenyaForm?.markAllAsTouched();

    this.oResenyaForm?.controls['album'].valueChanges.subscribe((change) => {
      if (change) {
        if (change.id) {
          // obtener el objeto tipocuenta del servidor
          this.oAlbumService.get(change.id).subscribe({
            next: (oAlbum: IAlbum) => {
              this.oResenya!.album = oAlbum;
            },
            error: (err) => {
              console.log(err);
              this.oResenya!.album = {} as IAlbum;
              // marcar el campo como inválido
              this.oResenyaForm?.controls['album'].setErrors({
                invalid: true,
              });
            },
          });
        } else {
          this.oResenya!.album = {} as IAlbum;
        }
      }
    });

    this.oResenyaForm?.controls['usuario'].valueChanges.subscribe((change) => {
      if (change) {
        if (change.id) {
          // obtener el objeto tipocuenta del servidor
          this.oUsuarioService.get(change.id).subscribe({
            next: (oUsuario: IUsuario) => {
              this.oResenya!.usuario = oUsuario;
            },
            error: (err) => {
              console.log(err);
              this.oResenya!.usuario = {} as IUsuario;
              // marcar el campo como inválido
              this.oResenyaForm?.controls['usuario'].setErrors({
                invalid: true,
              });
            },
          });
        } else {
          this.oResenya!.usuario = {} as IUsuario;
        }
      }
    });
  }

  onReset() {
    this.oResenyaService.get(this.id).subscribe({
      next: (oResenya: IResenya) => {
        this.oResenya = oResenya;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
    return false;
  }

  createForm() {
    this.oResenyaForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      nota: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      website: new FormControl(''),
      album: new FormGroup({
        id: new FormControl('', Validators.required),
        nombre: new FormControl(''),
        fecha: new FormControl(''),
        genero: new FormControl(''),
        descripcion: new FormControl(''),
        discografica: new FormControl(''),
        grupoalbumartistas: new FormControl([]),
        resenyas: new FormControl([]),
      }),
      usuario: new FormGroup({
        id: new FormControl('', Validators.required),
        nombre: new FormControl(''),
        fecha: new FormControl(''),
        descripcion: new FormControl(''),
        email: new FormControl(''),
        website: new FormControl(''),
        tipousuario: new FormControl([]),
        resenyas: new FormControl([]),
      }),
    });
  }

  updateForm() {
    this.oResenyaForm?.controls['id'].setValue(this.oResenya?.id);
    this.oResenyaForm?.controls['nota'].setValue(this.oResenya?.nota);
    this.oResenyaForm?.controls['descripcion'].setValue(
      this.oResenya?.descripcion
    );
    this.oResenyaForm?.controls['website'].setValue(this.oResenya?.website);
    this.oResenyaForm?.controls['album'].setValue(this.oResenya?.album);
    this.oResenyaForm?.controls['usuario'].setValue(this.oResenya?.usuario);
  }

  get() {
    this.oResenyaService.get(this.id).subscribe({
      next: (oResenya: IResenya) => {
        this.oResenya = oResenya;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
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
    if (!this.oResenyaForm?.valid) {
      this.showModal('Formulario no válido');
      return;
    } else {
      this.oResenyaService.update(this.oResenyaForm?.value).subscribe({
        next: (oResenya: IResenya) => {
          this.oResenya = oResenya;
          this.updateForm();
          this.showModal('Resenya ' + this.oResenya.id + ' actualizado');
        },
        error: (error) => {
          this.showModal('Error al actualizar el resenya');
          console.error(error);
        },
      });
    }
  }

  showAlbumSelectorModal() {
    const dialogRef = this.dialog.open(AlbumAdminSelectorUnroutedComponent, {
      height: '800px',
      maxHeight: '1200px',
      width: '80%',
      maxWidth: '90%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        const newAlbum = {
          id: result.id,
          nombre: result.nombre,
          fecha: result.fecha,
          genero: result.genero,
          descripcion: result.descripcion,
          discografica: result.discografica,
          grupoalbumartistas: result.grupoalbumartistas,
          resenyas: result.resenyas
        };

        this.oResenyaForm?.controls['album'].setValue(newAlbum);
        this.oResenya!.album = result;
        console.log(this.oResenyaForm?.value);
      }
    });
  }

  showUsuarioSelectorModal() {
    const dialogRef = this.dialog.open(UsuarioAdminSelectorUnroutedComponent, {
      height: '800px',
      maxHeight: '1200px',
      width: '80%',
      maxWidth: '90%',
    });

   

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);

        const newUsuario = {
          id: result.id,
          nombre: result.nombre,
          fecha: result.fecha,
          descripcion: result.descripcion,
          email: result.email,
          website: result.website,
          tipousuario: result.tipousuario,
          resenyas: result.resenyas
        };
        console.log(result);
        this.oResenyaForm?.controls['usuario'].setValue(newUsuario);
        this.oResenya!.usuario = result;
      }
    });
    return false;
  }
}
