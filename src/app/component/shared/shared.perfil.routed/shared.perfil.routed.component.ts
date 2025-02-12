import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';
import { ResenyaService } from '../../../service/resenya.service';
import { IPage } from '../../../environment/model.interface';
import { IResenya } from '../../../model/resenya.interface';

@Component({
  selector: 'app-shared.perfil.routed',
  templateUrl: './shared.perfil.routed.component.html',
  styleUrls: ['./shared.perfil.routed.component.css'],
})
export class SharedPerfilRoutedComponent implements OnInit {
  email: string = '';
  usuario: IUsuario = {} as IUsuario;
  pageResenya: IPage<IResenya> | null = null;

  constructor(private oActivatedRoute: ActivatedRoute, private oUsuarioService: UsuarioService, private oResenyaService: ResenyaService) {
    this.email = this.oActivatedRoute.snapshot.params['email'];
    this.oUsuarioService.getUsuarioByEmail(this.email).subscribe(
      (data: IUsuario) => {
        this.usuario = data;
        this.oResenyaService.getPageByUsuario(data.id, 0, 10, '','','').subscribe({
          next: (data:  IPage<IResenya>) => {
            this.pageResenya = data;
          }
        }
          
        );
      }
    );

  }

  ngOnInit() {}
}
