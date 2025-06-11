import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResenyaService } from '../../../service/resenya.service';
import { AlbumService } from '../../../service/album.service';
import { UsuarioService } from '../../../service/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { IAlbum } from '../../../model/album.interface';
import { IUsuario } from '../../../model/usuario.interface';
import { IResenya } from '../../../model/resenya.interface';
import { MatInputModule } from '@angular/material/input';
import { SessionService } from '../../../service/session.service';
import { InstanceOptions, Modal, ModalInterface, ModalOptions } from 'flowbite';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resenya-usuario-create-routed',
  templateUrl: './resenya.usuario.create.routed.component.html',
  styleUrls: ['./resenya.usuario.create.routed.component.css'],
  imports: [MatInputModule, ReactiveFormsModule, RouterModule, CommonModule],
})
export class ResenyaUsuarioCreateRoutedComponent
  implements OnInit, AfterViewInit
{
  id: number = 0;
  oResenyaForm: FormGroup | undefined = undefined;
  oResenya: IResenya | null = null;
  strMessage: string = '';
  email: string = '';

  isEdit: boolean = false;
  resenyamodal: HTMLElement | null = null;

  modal: ModalInterface | null = null;

  form: FormGroup = new FormGroup({});

  oUsuario: IUsuario = {} as IUsuario;

  isResenyaOk: boolean = false;

  readonly dialog = inject(MatDialog);

  modalOptions: ModalOptions = {
    placement: 'bottom-right',
    backdrop: 'dynamic',
    backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
    closable: true,
    onHide: () => {
      console.log('Modal is hidden');
      if (this.isResenyaOk) {
        this.oRouter.navigate(['/']);
      }
    },
    onShow: () => {
      console.log('Modal is shown');
    },
    onToggle: () => {
      console.log('Modal has been toggled');
    },
  };

  instanceOptions: InstanceOptions = {
    id: 'resenya-modal',
    override: true,
  };

  constructor(
    private oResenyaService: ResenyaService,
    private oRouter: Router,
    private oAlbumService: AlbumService,
    private oUsuarioService: UsuarioService,
    private oActivatedRoute: ActivatedRoute,
    private oSessionService: SessionService
  ) {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.email = this.oSessionService.getSessionEmail();
  }

  ngOnInit() {
    this.createForm();

    this.oUsuarioService.getUsuarioByEmail(this.email).subscribe((data) => {
      this.oUsuario = data;

      if (this.oResenyaForm) {
        this.oResenyaForm.get('usuario')?.setValue(this.oUsuario);
        this.oResenyaForm.get('album.id')?.setValue(this.id);
        this.oResenyaService
          .findResenyaByEmailAndAlbumId(this.email, this.id)
          .subscribe({
            next: (data) => {
              this.isEdit = true;
              this.oResenya = data;
              console.log('Resenya encontrada:', this.oResenya);

              this.oResenyaForm!.get('nota')?.setValue(this.oResenya.nota);
              this.oResenyaForm!.get('descripcion')?.setValue(
                this.oResenya.descripcion
              );
              this.oResenyaForm!.get('website')?.setValue(
                this.oResenya.website
              );
              console.log(
                'Formulario actualizado con la resenya:',
                this.oResenyaForm?.value
              );
            },
            error: (error) => {
              console.error('Error al obtener la resenya:', error);
              this.isEdit = false;
            },
          });
      } else {
        console.error('Error: El formulario no está inicializado.');
      }
    });

    this.oResenyaForm?.markAllAsTouched();
  }

  ngAfterViewInit() {
    this.resenyamodal = document.querySelector('#resenya-modal');

    if (this.resenyamodal) {
      this.modal = new Modal(
        this.resenyamodal,
        this.modalOptions,
        this.instanceOptions
      );
    } else {
      console.error('Modal element not found!');
    }
  }

  createForm() {
    this.oResenyaForm = new FormGroup({
      nota: new FormControl(0, [
        Validators.required,
        Validators.pattern(/^(10|[0-9])$/),
      ]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      website: new FormControl('', [Validators.maxLength(255)]),
      album: new FormGroup({
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
        username: new FormControl(''),
        nombre: new FormControl(''),
        fecha: new FormControl(''),
        descripcion: new FormControl(''),
        email: new FormControl(''),
        website: new FormControl(''),
        codresetpwd: new FormControl(''),
        codverf: new FormControl(''),
        tipousuario: new FormControl([]),
        resenyas: new FormControl([]),
      }),
    });
  }

  updateForm() {
    if (this.isEdit) {
      this.oResenyaForm!.get('nota')?.setValue(this.oResenya!.nota);
      this.oResenyaForm!.get('descripcion')?.setValue(
        this.oResenya!.descripcion
      );
      this.oResenyaForm!.get('website')?.setValue(this.oResenya!.website);
    } else {
      this.oResenyaForm!.get('nota')?.setValue('');
      this.oResenyaForm!.get('descripcion')?.setValue('');
      this.oResenyaForm!.get('website')?.setValue('');
    }
  }

  onReset() {
    this.updateForm();
    return false;
  }

  closeModal() {
  this.modal?.hide();
}

  onSubmit() {
    if (this.oResenyaForm?.valid) {
      if (this.isEdit) {
        let resenya: IResenya = this.oResenyaForm.value;
        resenya.id = this.oResenya?.id!;
        this.oResenyaService.update(resenya).subscribe({
          next: (data) => {
            this.isResenyaOk = true;
            this.oResenya = data;
            this.strMessage = `Resenya actualizada.`;
            this.modal?.show();
          },
          error: (err) => {
            this.strMessage = `Error al actualizar la resenya.`;
            this.modal?.show();
          },
        });
      } else {
        this.oResenyaService
          .checkIfResenyaExists(this.oResenyaForm.value)
          .subscribe((data) => {
            if (!data) {
              this.oResenyaService.create(this.oResenyaForm?.value).subscribe({
                next: (data) => {
                  this.isResenyaOk = true;
                  this.oResenya = data;
                  this.strMessage = `Resenya creada.`;
                  this.modal?.show();
                },
                error: (err) => {
                  this.strMessage = `Error al crear la resenya.`;
                  this.modal?.show();
                },
              });
            } else {
              this.strMessage = 'La resenya ya existe.';
              this.modal?.show();
            }
          });
      }
    } else {
      this.strMessage = 'El formulario no es valido.';
      this.modal?.show();
    }
  }

  get nota(): number {
    // parseInt por si el formControl devuelve string
    return parseInt(this.oResenyaForm?.get('nota')?.value, 10) || 0;
  }

  // Mapea la nota al nombre de la variable CSS correspondiente
  getGradeColorVar(): string {
    const m = this.nota;
    if (m < 5) return 'var(--low-grade-bg)';
    if (m < 7) return 'var(--medium-grade-bg)';
    if (m < 9) return 'var(--high-grade-bg)';
    return 'var(--excellent-grade-bg)';
  }
}
