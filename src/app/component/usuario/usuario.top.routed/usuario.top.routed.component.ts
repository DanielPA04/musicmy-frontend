import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../service/usuario.service';
import { serverURL } from '../../../environment/environment';
import { IUsuarioRankingDTO } from '../../../model/dto/usuarioRankingDTO.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario.top.routed',
  templateUrl: './usuario.top.routed.component.html',
  styleUrls: ['./usuario.top.routed.component.css'],
  imports: [CommonModule, RouterLink],
})
export class UsuarioTopRoutedComponent implements OnInit {
  usuariosTop: IUsuarioRankingDTO[] = [];
  url: string = serverURL;
  constructor(private oUsuarioService: UsuarioService) {}

  ngOnInit() {
    this.getTop();
  }

  getTop(): void {
    this.oUsuarioService.getTop20().subscribe({
      next: (data) => {
        console.log('Top 20 usuarios:', data);
        this.usuariosTop = data;
      },
      error: (error) => {
        console.error('Error fetching top 20 usuarios:', error);
        // Handle error appropriately
      },
    });
  }
}
