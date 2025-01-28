import { Component, OnInit } from '@angular/core';
import {
  EmailValidator,
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

const loginmodal: HTMLElement | null = document.querySelector('#login-modal');

@Component({
  selector: 'app-shared.login.routed',
  imports: [
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './shared.login.routed.component.html',
  styleUrls: ['./shared.login.routed.component.css']
})
export class SharedLoginRoutedComponent implements OnInit {


  oAuthForm: FormGroup | undefined = undefined;
  message: string = '';


  modalOptions: ModalOptions = {
    placement: 'bottom-right',
    backdrop: 'dynamic',
    backdropClasses:
      'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
    closable: true,
    onHide: () => {
      console.log('modal is hidden');
    },
    onShow: () => {
      console.log('modal is shown');
    },
    onToggle: () => {
      console.log('modal has been toggled');
    },
  }



   instanceOptions: InstanceOptions = {
    id: 'login-modal',
    override: true
  }

  modal: ModalInterface = new Modal(loginmodal, this.modalOptions, this.instanceOptions);


  constructor(private oLoginService: LoginService, private oSessionService: SessionService, private oRouter: Router) { }

  ngOnInit() {
    this.createForm();
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
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]),
    });
  }

  onSubmit() {
    this.modal.show();

    this.oLoginService.login(this.oAuthForm?.value).subscribe({
      next: (oAuth: string) => {
        console.log(oAuth);
        this.oSessionService.login(oAuth);
        this.message = 'Login exitoso';
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

 



}
