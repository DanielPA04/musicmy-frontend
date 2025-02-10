import { Component, inject, OnInit } from '@angular/core';
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
import { AlbumService } from '../../../service/album.service';
import { IAlbum } from '../../../model/album.interface';
import { IUsuario } from '../../../model/usuario.interface';
import { UsuarioService } from '../../../service/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { AlbumAdminSelectorUnroutedComponent } from '../../album/album.admin.selector.unrouted/album.admin.selector.unrouted.component';
import { UsuarioAdminSelectorUnroutedComponent } from '../../usuario/usuario.admin.selector.unrouted/usuario.admin.selector.unrouted.component';

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

  oAlbum: IAlbum = {} as IAlbum;
  oUsuario: IUsuario = {} as IUsuario;

  readonly dialog = inject(MatDialog);




  constructor(
    private oResenyaService: ResenyaService,
    private oRouter: Router,
    private oAlbumService: AlbumService,
    private oUsuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.createForm();
    this.oResenyaForm?.markAllAsTouched();

    this.oResenyaForm?.controls['album'].valueChanges.subscribe(change => {
      if (change) {
        if (change.id) {
          // obtener el objeto tipocuenta del servidor
          this.oAlbumService.get(change.id).subscribe({
            next: (oAlbum: IAlbum) => {
              this.oAlbum = oAlbum;
            },
            error: (err) => {
              console.log(err);
              this.oAlbum = {} as IAlbum;
              // marcar el campo como inválido
              this.oResenyaForm?.controls['album'].setErrors({
                invalid: true,
              });
            }
          });
        } else {
          this.oAlbum = {} as IAlbum;
        }
      }
    });

    this.oResenyaForm?.controls['usuario'].valueChanges.subscribe(change => {
      if (change) {
        if (change.id) {
          // obtener el objeto tipocuenta del servidor
          this.oUsuarioService.get(change.id).subscribe({
            next: (oUsuario: IUsuario) => {
              this.oUsuario = oUsuario;
            },
            error: (err) => {
              console.log(err);
              this.oUsuario = {} as IUsuario;
              // marcar el campo como inválido
              this.oResenyaForm?.controls['usuario'].setErrors({
                invalid: true,
              });
            }
          });
        } else {
          this.oUsuario = {} as IUsuario;
        }
      }
    });

    
  }

  createForm() {
    this.oResenyaForm = new FormGroup({
      nota: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      website: new FormControl(''),
      album: new FormGroup( {
        id: new FormControl('', Validators.required),
        nombre: new FormControl(''),
        fecha: new FormControl(''),
        genero: new FormControl(''),
        descripcion: new FormControl(''),
        discografica: new FormControl(''),
        img: new FormControl(null), 
        grupoalbumartistas: new FormControl([]),
        resenyas: new FormControl([]),
      }),
      usuario: new FormGroup({
        id: new FormControl('', Validators.required),
        nombre: new FormControl(''),
        fecha: new FormControl(''),
        descripcion: new FormControl(''),
        email: new FormControl(''),
        password: new FormControl(''),
        website: new FormControl(''),
        tipousuario: new FormControl([]),
        resenyas: new FormControl([]),
      }),

    });
  }

  updateForm() {
    this.oResenyaForm?.controls['nota'].setValue('');
    this.oResenyaForm?.controls['descripcion'].setValue('');
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
      console.log(this.oResenyaForm?.value);



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

  showAlbumSelectorModal() {
    const dialogRef = this.dialog.open(AlbumAdminSelectorUnroutedComponent, {
      height: '800px',
      maxHeight: '1200px',
      width: '80%',
      maxWidth: '90%',


    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);
        this.oResenyaForm?.controls['album'].setValue(result);
        this.oAlbum = result;
      }
    });
    return false;
  }

  showUsuarioSelectorModal() {
    const dialogRef = this.dialog.open(UsuarioAdminSelectorUnroutedComponent, {
      height: '800px',
      maxHeight: '1200px',
      width: '80%',
      maxWidth: '90%',


    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log(result);
        this.oResenyaForm?.controls['usuario'].setValue(result);
        this.oAlbum = result;
      }
    });
    return false;
  }

}
