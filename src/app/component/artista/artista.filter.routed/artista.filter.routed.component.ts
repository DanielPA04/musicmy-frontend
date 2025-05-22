import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { IPage } from '../../../environment/model.interface';
import { IArtista } from '../../../model/artista.interface';
import { ArtistaService } from '../../../service/artista.service';
import { serverURL } from '../../../environment/environment';
import { BotoneraService } from '../../../service/botonera.service';

@Component({
  selector: 'app-artista-filter-routed',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './artista.filter.routed.component.html',
  styleUrls: ['./artista.filter.routed.component.css'],
})
export class ArtistaFilterRoutedComponent implements OnInit {
  filterForm!: FormGroup;
  pageData?: IPage<IArtista>;
  loading = signal(false);
  errorMsg = signal<string | undefined>(undefined);
  botonera: string[] = [];

  page = 0;
  size = 10;

  // para la URL de la foto
  serverURL = serverURL;

  constructor(
    private fb: FormBuilder,
    private oArtistaService: ArtistaService,
    private route: ActivatedRoute,
    private router: Router,
    private oBotoneraService: BotoneraService
  ) {}

  ngOnInit() {
    this.filterForm = this.fb.group({ filter: [''] });

    this.route.queryParams.subscribe((params) => {
      this.page = +params['page'] || 0;
      this.filterForm.patchValue({ filter: params['filter'] || '' });
      this.loadPage();
    });
  }

  private updateUrl() {
    const { filter } = this.filterForm.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.page, filter: filter || null },
      queryParamsHandling: 'merge',
    });
  }

  loadPage() {
    this.loading.set(true);
    this.errorMsg.set(undefined);
    const { filter } = this.filterForm.value;

    this.oArtistaService
      .getPage(this.page, this.size, '', '', filter)
      .subscribe({
        next: (page) => {
          this.pageData = page;
          this.botonera = this.oBotoneraService.getBotonera(
            this.page,
            this.pageData.totalPages
          );

          this.loading.set(false);
        },
        error: () => {
          this.errorMsg.set('Error al cargar artistas');
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

  get pages(): number[] {
    return this.pageData
      ? Array(this.pageData.totalPages)
          .fill(0)
          .map((_, i) => i)
      : [];
  }
}
