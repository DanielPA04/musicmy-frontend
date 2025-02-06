import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { SessionService } from '../../../service/session.service';
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';


@Component({
  selector: 'app-shared.login.routed',
  imports: [
    ReactiveFormsModule,
    RouterModule,
  ],
  standalone: true,
  templateUrl: './shared.login.routed.component.html',
  styleUrls: ['./shared.login.routed.component.css']
})
export class SharedLoginRoutedComponent implements OnInit, AfterViewInit {

  loginmodal: HTMLElement | null = null;
  modal: ModalInterface | null = null;
  oAuthForm: FormGroup | undefined = undefined;
  message: string = '';
  passwordVisible: boolean = false;
  isLog: boolean = false;


  modalOptions: ModalOptions = {
    placement: 'bottom-right',
    backdrop: 'dynamic',
    backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
    closable: true,
    onHide: () => {
      console.log('Modal is hidden');
      if (this.isLog) {
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
    id: 'login-modal',
    override: true
  };

  constructor(
    private oLoginService: LoginService,
    private oSessionService: SessionService,
    private oRouter: Router
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    // Asegúrate de que el DOM ya está listo
    this.loginmodal = document.querySelector('#login-modal');
    if (this.loginmodal) {
      this.modal = new Modal(this.loginmodal, this.modalOptions, this.instanceOptions);
    } else {
      console.error('Modal element not found!');
    }
  }

  createForm() {
    this.oAuthForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
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
      return;
    } else {


      this.oLoginService.login(this.oAuthForm?.value).subscribe({
        next: (oAuth: string) => {
          console.log(oAuth);
          this.oSessionService.login(oAuth);
          this.message = 'Login exitoso';
          this.isLog = true;
          this.modal?.show();
        },
        error: (err) => {
          console.log(err);
          this.message = 'Error al iniciar sesión';
          this.modal?.show();
        },
      });
    }
  }

  trogglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
}