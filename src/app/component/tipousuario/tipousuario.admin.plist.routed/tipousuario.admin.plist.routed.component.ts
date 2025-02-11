import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../environment/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { ITipousuario } from '../../../model/tipousuario.iterface';
import { TipousuarioService } from '../../../service/tipousuario.service';

@Component({
  selector: 'app-tipousuario.admin.plist.routed',
  standalone: true,
  templateUrl: './tipousuario.admin.plist.routed.component.html',
  styleUrls: ['./tipousuario.admin.plist.routed.component.css'],
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class TipousuarioAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<ITipousuario> | null = null;
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
    private oTipousuarioService: TipousuarioService,
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
    this.oTipousuarioService
      .getPage(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro
      )
      .subscribe({
        next: (oPageFromServer: IPage<ITipousuario>) => {
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

  edit(oTipousuario: ITipousuario) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/tipousuario/edit', oTipousuario.id]);
  }

  view(oTipousuario: ITipousuario) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/tipousuario/view', oTipousuario.id]);
  }

  remove(oTipousuario: ITipousuario) {
    this.oRouter.navigate(['admin/tipousuario/delete/', oTipousuario.id]);
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

