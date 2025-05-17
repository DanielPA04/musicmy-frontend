import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SessionService } from '../../../service/session.service';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { serverURL } from '../../../environment/environment';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-usuario-perfil-edit',
  templateUrl: './usuario.perfil.edit.routed.component.html',
  styleUrls: ['./usuario.perfil.edit.routed.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class UsuarioPerfilEditRoutedComponent implements OnInit {
  form!: FormGroup;
  email = '';
  usuario!: IUsuario;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  serverURL = serverURL; // base URL

  showPwdModal = false;
  pwdForm!: FormGroup;
  changePwdSuccess = '';
  changePwdError = '';

  constructor(
    private fb: FormBuilder,
    private oUsuarioService: UsuarioService,
    private oSessionService: SessionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      fecha: ['', Validators.required],
      descripcion: [''],
      website: [''],
    });

    this.pwdForm = this.fb.nonNullable.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(255),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.matchPasswords }
    );

    this.email = this.oSessionService.getSessionEmail();
    if (this.email) {
      this.oUsuarioService.getUsuarioByEmail(this.email).subscribe({
        next: (u) => {
          this.usuario = u;
          this.form.patchValue({
            nombre: u.nombre,
            fecha: u.fecha,
            descripcion: u.descripcion,
            website: u.website,
          });
          // Mostrar foto actual al cargar
          this.previewUrl = `${this.serverURL}/usuario/${u.id}/img`;
        },
        error: (err) => console.error('Error fetching user data:', err),
      });
    }

    // inicializa también el formulario de contraseña
  }

  matchPasswords: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const group = control as FormGroup;
    const np = group.get('newPassword')?.value;
    const cp = group.get('confirmPassword')?.value;
    return np === cp ? null : { mismatch: true };
  };

  openChangePwdModal() {
    this.pwdForm.reset(); // limpia campos
    this.changePwdError = ''; // borra mensaje de error
    this.changePwdSuccess = ''; // borra mensaje de éxito
    this.showPwdModal = true; // abre modal
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const updated: IUsuario = { ...this.usuario, ...this.form.value };
    if (this.selectedFile) {
      updated.img = this.selectedFile;
    }
    this.oUsuarioService.update(updated).subscribe({
      next: (res) => console.log('Perfil guardado', res),
      error: (err) => console.error('Error al guardar perfil', err),
    });
  }

  onChangePassword() {
    if (this.pwdForm.invalid) {
      this.pwdForm.markAllAsTouched();
      return;
    }
    const { oldPassword, newPassword } = this.pwdForm.value;
    this.authService
      .changePassword(newPassword!, this.email, oldPassword!)
      .subscribe({
        next: () => {
          this.changePwdSuccess = 'Contraseña cambiada con éxito';
          this.showPwdModal = false;
        },
        error: () => {
          this.changePwdError = 'No se pudo cambiar la contraseña.';
        },
      });
  }
}
