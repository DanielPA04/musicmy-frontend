import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistaService } from '../../../service/artista.service';
import { IArtista } from '../../../model/artista.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-artista.admin.view.routed',
  templateUrl: './artista.admin.view.routed.component.html',
  standalone: true,
  styleUrls: ['./artista.admin.view.routed.component.css'],
})
export class ArtistaAdminViewRoutedComponent implements OnInit {
  //
  id: number = 0;
  oArtista: IArtista = {} as IArtista;
  //
  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oArtistaService: ArtistaService
  ) {}

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.oArtistaService.getOne(this.id).subscribe({
      next: (data: IArtista) => {
        this.oArtista = data;
      },
    });
  }
}
