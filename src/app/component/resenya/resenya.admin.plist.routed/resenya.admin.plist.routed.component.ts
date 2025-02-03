import { Component, OnInit } from '@angular/core';
import { ResenyaService } from '../../../service/resenya.service';
import { IResenya } from '../../../model/resenya.interface';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../environment/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';

@Component({
  selector: 'app-resenya.admin.plist.routed',
  standalone: true,
  templateUrl: './resenya.admin.plist.routed.component.html',
  styleUrls: ['./resenya.admin.plist.routed.component.css'],
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class ResenyaAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<IResenya> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = '';
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  //
  private debounceSubject = new Subject<string>();

  constructor(
    private oResenyaService: ResenyaService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
  }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oResenyaService
      .getPage(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro
      )
      .subscribe({
        next: (oPageFromServer: IPage<IResenya>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  edit(oResenya: IResenya) {
    this.oRouter.navigate(['admin/resenya/edit', oResenya.id]);
  }

  view(oResenya: IResenya) {
    this.oRouter.navigate(['admin/resenya/view', oResenya.id]);
  }

  remove(oResenya: IResenya) {
    this.oRouter.navigate(['admin/resenya/delete/', oResenya.id]);
  }

  goToPage(p: number) {
    if (p) {
      this.nPage = p - 1;
      this.getPage();
    }
    return false;
  }

  goToNext() {
    this.nPage++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.nPage--;
    this.getPage();
    return false;
  }

  sort(field: string) {
    this.strField = field;
    this.strDir = this.strDir === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  goToRpp(nrpp: number) {
    this.nPage = 0;
    this.nRpp = nrpp;
    this.getPage();
    return false;
  }

  filter(event: KeyboardEvent) {
    this.debounceSubject.next(this.strFiltro);
  }
}

