import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedSpinnerUnroutedComponent } from '../../shared/shared.spinner.unrouted/shared.spinner.unrouted.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { SessionService } from '../../../service/session.service';
import { InstanceOptions, Modal, ModalInterface, ModalOptions } from 'flowbite';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth.pwd.token',
  templateUrl: './auth.pwd.token.component.html',
  styleUrls: ['./auth.pwd.token.component.css'],
  imports: [MatProgressSpinnerModule, ReactiveFormsModule],
})
export class AuthPwdTokenComponent implements OnInit {
  loginmodal: HTMLElement | null = null;
  modal: ModalInterface | null = null;
  oAuthForm: FormGroup | undefined = undefined;
  message: string = '';

  token: string = '';
  success: boolean = false;
  isSend: boolean = false;

  dialogRef!: MatDialogRef<SharedSpinnerUnroutedComponent>;

  modalOptions: ModalOptions = {
    placement: 'bottom-right',
    backdrop: 'dynamic',
    backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
    closable: true,
    onHide: () => {
      console.log('Modal is hidden');
      if (this.isSend) {
        this.oRouter.navigate(['/']);
      }
    },
    onShow: () => {
      console.log('Modal is shown');
      this.dialogRef.close();
    },
    onToggle: () => {
      console.log('Modal has been toggled');
    },
  };

  instanceOptions: InstanceOptions = {
    id: 'login-modal',
    override: true,
  };

  constructor(
    private oActivedRoute: ActivatedRoute,
    private oAuthService: AuthService,
    private oRouter: Router,
    private oSessionService: SessionService,
    private dialog: MatDialog
  ) {
    this.token = this.oActivedRoute.snapshot.params['token'];
  }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    // Asegúrate de que el DOM ya está listo
    this.loginmodal = document.querySelector('#login-modal');
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
    this.oAuthForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
      ]),
    });
  }




   onSubmit() {
    if (this.oAuthForm?.invalid) {
      const controls = this.oAuthForm.controls;

      // Verificar errores en cada control
      for (const controlName in controls) {
        if (controls[controlName].errors) {
          const errors = controls[controlName].errors;
          if (errors['required']) {
            this.message = `El campo ${controlName} es requerido.`;
          } else if (errors['minlength']) {
            this.message = `El campo ${controlName} debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
          } else if (errors['maxlength']) {
            this.message = `El campo ${controlName} no puede tener más de ${errors['maxlength'].requiredLength} caracteres.`;
          } else if (errors['pattern']) {
            this.message =
              `El campo ${controlName} no cumple con el formato requerido. Debe usar por lo menos 1 número, 1 mayúscula y 1 minúscula`;
          } else {
            this.message = `El campo ${controlName} es inválido.`;
          }
          this.modal?.show();
          break;
        }
      }
      return;
    } else {
      this.dialogRef = this.dialog.open(SharedSpinnerUnroutedComponent, {
        disableClose: true,
        panelClass: 'transparent-dialog',
      });
      this.oAuthService.changePassword(this.oAuthForm?.value, undefined,undefined ,this.token).subscribe({
        next: (data: string) => {
         this.message = 'Contraseña cambiada con exito';
          this.isSend = true;
          this.modal?.show();
        },
        error: (err) => {
          console.log(err);
          this.message = 'Error al cambiar la contraseña';
          this.modal?.show();
        },
      });
     
    }
  }

 
}
