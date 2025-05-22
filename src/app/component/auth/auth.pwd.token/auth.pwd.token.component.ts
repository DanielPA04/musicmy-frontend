// auth.pwd.token.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Modal, ModalInterface, ModalOptions, InstanceOptions } from 'flowbite';
import { SharedSpinnerUnroutedComponent } from '../../shared/shared.spinner.unrouted/shared.spinner.unrouted.component';
import { AuthService } from '../../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-pwd-token',
  templateUrl: './auth.pwd.token.component.html',
  styleUrls: ['./auth.pwd.token.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AuthPwdTokenComponent implements OnInit, AfterViewInit {
  oAuthForm!: FormGroup;
  message = '';
  isSend = false;
  token = '';

  passwordVisible = false;
  confirmPasswordVisible = false;

  loginmodal: HTMLElement | null = null;
  modal: ModalInterface | null = null;
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
      this.dialogRef.close();

      console.log('Modal is shown');
    },
    onToggle: () => {
      console.log('Modal has been toggled');
    },
  };
  instanceOptions: InstanceOptions = { id: 'login-modal', override: true };

  constructor(
    private oActivedRoute: ActivatedRoute,
    private oAuthService: AuthService,
    private oRouter: Router,
    private dialog: MatDialog
  ) {
    this.token = this.oActivedRoute.snapshot.params['token'];
  }

  ngOnInit() {
    this.oAuthForm = new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(255),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
        ]),
        confirmPassword: new FormControl('', Validators.required),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngAfterViewInit() {
    this.loginmodal = document.querySelector('#login-modal');
    if (this.loginmodal) {
      this.modal = new Modal(
        this.loginmodal,
        this.modalOptions,
        this.instanceOptions
      );
    }
  }

  private passwordsMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const pass = group.get('password')!.value;
    const confirm = group.get('confirmPassword')!.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  get passwordCtrl(): FormControl {
    return this.oAuthForm.get('password') as FormControl;
  }
  get confirmPasswordCtrl(): FormControl {
    return this.oAuthForm.get('confirmPassword') as FormControl;
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
  toggleConfirmPassword() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  onSubmit() {
    if (this.oAuthForm.invalid) {
      if (this.passwordCtrl.errors) {
        if (this.passwordCtrl.errors['required']) {
          this.message = 'La contraseña es obligatoria.';
        } else if (this.passwordCtrl.errors['minlength']) {
          this.message = `Debe tener al menos ${this.passwordCtrl.errors['minlength'].requiredLength} caracteres.`;
        } else if (this.passwordCtrl.errors['maxlength']) {
          this.message = `No puede exceder ${this.passwordCtrl.errors['maxlength'].requiredLength} caracteres.`;
        } else if (this.passwordCtrl.errors['pattern']) {
          this.message = 'Debe incluir mayúscula, minúscula y número.';
        }
      } else if (this.oAuthForm.errors?.['passwordMismatch']) {
        this.message = 'Las contraseñas no coinciden.';
      }
      this.modal?.show();
      return;
    }

    this.dialogRef = this.dialog.open(SharedSpinnerUnroutedComponent, {
      disableClose: true,
      panelClass: 'transparent-dialog',
    });
    this.oAuthService
      .changePassword(this.passwordCtrl.value, undefined, undefined, this.token)
      .subscribe({
        next: () => {
          this.message = 'Contraseña cambiada con éxito';
          this.isSend = true;

          this.modal?.show();
        },
        error: () => {
          this.message =
            'Error al cambiar la contraseña, token inválido o expirado.';
          this.modal?.show();
        },
      });
  }
}
