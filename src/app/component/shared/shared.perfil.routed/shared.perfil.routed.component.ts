import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';

@Component({
  selector: 'app-shared.perfil.routed',
  templateUrl: './shared.perfil.routed.component.html',
  styleUrls: ['./shared.perfil.routed.component.css'],
})
export class SharedPerfilRoutedComponent implements OnInit {
  email: string = '';
  usuario: IUsuario = {} as IUsuario;

  constructor(private oActivatedRoute: ActivatedRoute, private oUsuarioService: UsuarioService) {
    this.email = this.oActivatedRoute.snapshot.params['email'];
    this.oUsuarioService.getUsuarioByEmail(this.email).subscribe(
      (data: IUsuario) => {
        this.usuario = data;
      }
    );

  }

  ngOnInit() {}
}
