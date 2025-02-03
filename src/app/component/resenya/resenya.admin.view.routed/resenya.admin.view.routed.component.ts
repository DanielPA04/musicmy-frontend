import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistaService } from '../../../service/artista.service';
import { IArtista } from '../../../model/artista.interface';

@Component({
  selector: 'app-resenya.admin.view.routed',
  templateUrl: './resenya.admin.view.routed.component.html',
  standalone: true,
  styleUrls: ['./resenya.admin.view.routed.component.css'],
})
export class ResenyaAdminViewRoutedComponent implements OnInit {
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
    this.oArtistaService.get(this.id).subscribe({
      next: (data: IArtista) => {
        this.oArtista = data;
      },
    });
  }
}
