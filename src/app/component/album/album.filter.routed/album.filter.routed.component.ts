import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { IPage } from '../../../environment/model.interface';
import { IAlbum } from '../../../model/album.interface';
import { IArtista } from '../../../model/artista.interface';
import { AlbumService } from '../../../service/album.service';
import { ArtistaService } from '../../../service/artista.service';
import { serverURL } from '../../../environment/environment';
import { BotoneraService } from '../../../service/botonera.service';

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
  mediasAlbum = new Map<number, number>(); // ← mapa de notas medias
  loading = signal(false);
  errorMsg = signal<string | undefined>(undefined);
  botonera: string[] = [];

  // paginación
  page = 0;
  size = 12;

  serverURL = serverURL;

  // móvil: mostrar/ocultar filtros
  showFilters = false;

  constructor(
    private fb: FormBuilder,
    private albumService: AlbumService,
    private artistaService: ArtistaService,
    private route: ActivatedRoute,
    private router: Router,
    private oBotoneraService: BotoneraService
  ) {}

  ngOnInit() {
    this.filterForm = this.fb.group({
      genero: [''],
      discografica: [''],
      nombre: [''],
      sort: ['fecha,desc'],
      mode: ['recent'],
    });

    // Lee queryParams al inicio
    this.route.queryParams.subscribe((params) => {
      this.page = +params['page'] || 0;
      this.filterForm.patchValue({
        genero: params['genero'] || '',
        discografica: params['discografica'] || '',
        nombre: params['nombre'] || '',
        sort: params['sort'] || 'fecha,desc',
        mode: params['mode'] || 'recent',
      });
      this.loadPage();
    });
  }

  private updateUrl() {
    const { genero, discografica, nombre, sort, mode } = this.filterForm.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        genero: genero || null,
        discografica: discografica || null,
        nombre: nombre || null,
        sort,
        mode,
      },
      queryParamsHandling: 'merge',
    });
  }

  loadPage() {
    this.loading.set(true);
    this.errorMsg.set(undefined);

    const { genero, discografica, nombre, sort, mode } = this.filterForm.value;
    const [field, dir] = (sort as string).split(',') as [
      'fecha' | 'nombre',
      'asc' | 'desc'
    ];

    let obs$;
    switch (mode) {
      case 'top-rated':
        obs$ = this.albumService.getPageTopRated(
          this.page,
          this.size,
          field,
          dir,
          genero,
          discografica,
          nombre
        );
        break;
      case 'popular':
        obs$ = this.albumService.getPagePopularRecent(
          this.page,
          this.size,
          field,
          dir,
          genero,
          discografica,
          nombre
        );
        break;
      default: // recent
        obs$ = this.albumService.getFilteredPage(
          this.page,
          this.size,
          field,
          dir,
          genero,
          discografica,
          nombre
        );
    }

    obs$.subscribe({
      next: (page) => {
        this.pageData = page;
        this.botonera = this.oBotoneraService.getBotonera(
          this.page,
          this.pageData.totalPages
        );

        this.nombresArtista.clear();
        this.mediasAlbum.clear(); // ← limpiamos notas anteriores

        page.content.forEach((alb) => {
          // cargar artistas
          this.artistaService.getByAlbum(alb.id).subscribe((list) => {
            this.nombresArtista.set(alb.id, list);
          });
          // cargar nota media
          this.albumService.getMedia(alb.id).subscribe((media) => {
            this.mediasAlbum.set(alb.id, media);
          });
        });

        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Error al cargar álbumes');
        this.pageData = undefined;
        this.loading.set(false);
      },
    });
  }

  onFilter() {
    this.page = 0;
    this.updateUrl();
  }

  goToPage(p: number) {
    if (!this.pageData) return;
    this.page = Math.max(0, Math.min(p, this.pageData.totalPages - 1));
    this.updateUrl();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  get pages(): number[] {
    return this.pageData
      ? Array(this.pageData.totalPages)
          .fill(0)
          .map((_, i) => i)
      : [];
  }

  // método auxiliar para obtener nota en plantilla
  getMedia(albumId: number): number {
    return this.mediasAlbum.get(albumId) ?? 0;
  }
}
