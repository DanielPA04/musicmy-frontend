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
  selector: 'app-shared.register.routed',
  templateUrl: './shared.register.routed.component.html',
  standalone: true,
  styleUrls: ['./shared.register.routed.component.css']
})
export class SharedRegisterRoutedComponent implements OnInit, AfterViewInit {

  loginmodal: HTMLElement | null = null;
  modal: ModalInterface | null = null;
  oAuthForm: FormGroup | undefined = undefined;
  message: string = '';
  passwordVisible: boolean = false;

  constructor(
    private oLoginService: LoginService,
    private oSessionService: SessionService,
    private oRouter: Router
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

 

  ngAfterViewInit(): void {
  }

  createForm() {
    this.oAuthForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
      ]),
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
  
    this.oLoginService.login(this.oAuthForm?.value).subscribe({
      next: (oAuth: string) => {
        console.log(oAuth);
        this.oSessionService.login(oAuth);
        this.message = 'Login exitoso';
        this.modal?.show();
      },
      error: (err) => {
        console.log(err);
        this.message = 'Error al iniciar sesión';
      },
    });
  }

  trogglePassword(){
    this.passwordVisible = !this.passwordVisible;
  }

}
