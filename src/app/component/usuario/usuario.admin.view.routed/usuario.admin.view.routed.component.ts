import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';

@Component({
  selector: 'app-usuario.admin.view.routed',
  templateUrl: './usuario.admin.view.routed.component.html',
  standalone: true,
  styleUrls: ['./usuario.admin.view.routed.component.css'],
})
export class UsuarioAdminViewRoutedComponent implements OnInit {
  //
  id: number = 0;
  oUsuario: IUsuario = {} as IUsuario;
  //
  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oUsuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.oUsuarioService.get(this.id).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;
      },
    });
  }
}
