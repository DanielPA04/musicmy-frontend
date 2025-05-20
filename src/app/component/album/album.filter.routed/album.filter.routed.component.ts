import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IPage } from '../../../environment/model.interface';
import { IAlbum } from '../../../model/album.interface';
import { IArtista } from '../../../model/artista.interface';
import { AlbumService } from '../../../service/album.service';
import { ArtistaService } from '../../../service/artista.service';
import { serverURL } from '../../../environment/environment';

@Component({
  selector: 'app-album-filter-routed',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './album.filter.routed.component.html',
})
export class AlbumFilterRoutedComponent implements OnInit {
  filterForm!: FormGroup;
  pageData?: IPage<IAlbum>;
  nombresArtista = new Map<number, IArtista[]>();
  loading = signal(false);
  errorMsg = signal<string|undefined>(undefined);

  // paginación
  page = 0;
  size = 12;

  serverURL = serverURL;

  // móvil: mostrar/ocultar filtros
  showFilters = false;
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  constructor(
    private fb: FormBuilder,
    private albumService: AlbumService,
    private artistaService: ArtistaService
  ) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      genero: [''],
      discografica: [''],
      nombre: [''],
      sort: ['fecha,desc']
    });

    this.loadPage();
  }

  loadPage() {
    this.loading.set(true);
    this.errorMsg.set(undefined);
    const { genero, discografica, nombre, sort } = this.filterForm.value;
    const [field, dir] = (sort as string).split(',') as ['fecha'|'nombre','asc'|'desc'];
    this.albumService
      .getFilteredPage(this.page, this.size, field, dir, genero, discografica, nombre)
      .subscribe({
        next: page => {
          this.pageData = page;
          this.nombresArtista.clear();
          page.content.forEach(alb => {
            this.artistaService.getByAlbum(alb.id).subscribe(list => {
              this.nombresArtista.set(alb.id, list);
            });
          });
          this.loading.set(false);
        },
        error: () => {
          this.errorMsg.set('Error al cargar álbumes');
          this.pageData = undefined;
          this.loading.set(false);
        }
      });
  }

  onFilter() {
    this.page = 0;
    this.loadPage();
  }

  goToPage(p: number) {
    if (!this.pageData) return;
    this.page = Math.max(0, Math.min(p, this.pageData.totalPages - 1));
    this.loadPage();
  }

  get pages(): number[] {
    return this.pageData
      ? Array(this.pageData.totalPages).fill(0).map((_, i) => i)
      : [];
  }
}
