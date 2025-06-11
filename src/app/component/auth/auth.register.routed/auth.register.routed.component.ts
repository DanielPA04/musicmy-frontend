import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../service/session.service';
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedSpinnerUnroutedComponent } from '../../shared/shared.spinner.unrouted/shared.spinner.unrouted.component';

@Component({
  selector: 'app-shared.register.routed',
  templateUrl: './auth.register.routed.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  styleUrls: ['./auth.register.routed.component.css'],
})
export class AuthRegisterRoutedComponent implements OnInit, AfterViewInit {
  loginmodal: HTMLElement | null = null;
  modal: ModalInterface | null = null;
  oRegisterForm: FormGroup | undefined = undefined;
  message: string = '';
  passwordVisible: boolean = false;

  isLoading: boolean = false;
  dialogRef!: MatDialogRef<SharedSpinnerUnroutedComponent>;
  registered: boolean = false;
  constructor(
    private oUsuarioService: UsuarioService,
    private oSessionService: SessionService,
    private oRouter: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.createForm();
  }

  modalOptions: ModalOptions = {
    placement: 'bottom-right',
    backdrop: 'dynamic',
    backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
    closable: true,
    onHide: () => {
      console.log('Modal is hidden');
      if (this.registered) {
        this.oRouter.navigate(['/home']);
      }
    },
    onShow: () => {
      console.log('Modal is shown');
      this.isLoading = false;
      this.dialogRef.close();
    },
    onToggle: () => {
      console.log('Modal has been toggled');
    },
  };

  instanceOptions: InstanceOptions = {
    id: 'register-modal',
    override: true,
  };

  ngAfterViewInit() {
    // Asegúrate de que el DOM ya está listo
    this.loginmodal = document.querySelector('#register-modal');
    console.log(this.loginmodal);
    if (this.loginmodal) {
      this.modal = new Modal(
        this.loginmodal,
        this.modalOptions,
        this.instanceOptions
      );
    } else {
      console.error('Modal element not found!');
    }
  }

  createForm() {
    this.oRegisterForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
      ]),
    });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.oRegisterForm?.invalid) {
      const controls = this.oRegisterForm.controls;

      // Verificar errores en cada control
      for (const controlName in controls) {
        if (controls[controlName].errors) {
          const errors = controls[controlName].errors;

          if (errors['required']) {
            this.message = `El campo ${controlName} es requerido.`;
          } else if (errors['email']) {
            this.message = `El campo ${controlName} debe ser un email válido.`;
          } else if (errors['minlength']) {
            this.message = `El campo ${controlName} debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
          } else if (errors['maxlength']) {
            this.message = `El campo ${controlName} no puede tener más de ${errors['maxlength'].requiredLength} caracteres.`;
          } else if (errors['pattern']) {
            this.message =
              'El campo ${controlName} no cumple con el formato requerido. Debe usar por lo menos 1 número, 1 mayúscula y 1 minúscula';
          } else {
            this.message = `El campo ${controlName} es inválido.`;
          }
          this.modal?.show();
          break;
        }
      }
      this.isLoading = false;
      return;
    } else {
      this.oUsuarioService
        .checkIfUsernameExists(this.oRegisterForm?.controls['username'].value)
        .subscribe({
          next: (data: boolean) => {
            if (data) {
              this.message =
                'El username ' +
                this.oRegisterForm?.controls['username'].value +
                ' ya esta registrado';
              this.modal?.show();
              this.isLoading = false;
            } else {
              this.oUsuarioService
                .checkIfEmailExists(this.oRegisterForm?.controls['email'].value)
                .subscribe({
                  next: (data: boolean) => {
                    if (data) {
                      this.message =
                        'El email ' +
                        this.oRegisterForm?.controls['email'].value +
                        ' ya esta registrado';
                      this.modal?.show();
                      this.isLoading = false;
                    } else {
                      this.dialogRef = this.dialog.open(
                        SharedSpinnerUnroutedComponent,
                        {
                          disableClose: true,
                          panelClass: 'transparent-dialog',
                        }
                      );
                      this.oUsuarioService
                        .register(this.oRegisterForm?.value)
                        .subscribe({
                          next: (data: IUsuario) => {
                            console.log(data);
                            this.registered = true;
                            this.message = 'Registro exitoso';
                            this.modal?.show();
                            this.isLoading = false;
                          },
                          error: (err) => {
                            console.log(err);
                            this.message = 'Error';
                            this.modal?.show();
                            this.isLoading = false;
                          },
                        });
                    }
                  },
                  error: (err) => {
                    console.log(err);
                    this.message = 'Error' + err;
                    this.isLoading = false;
                    this.modal?.show();
                  },
                });
            }
          },
          error: (err) => {
            console.log(err);
            this.isLoading = false;
            this.message = 'Error';
            this.modal?.show();
          },
        });
    }
  }

  trogglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
}
