import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../service/album.service';
import { IAlbum } from '../../../model/album.interface';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';

@Component({
  selector: 'app-album.admin.plist.routed',
  standalone: true,
  templateUrl: './album.admin.plist.routed.component.html',
  styleUrls: ['./album.admin.plist.routed.component.css'],
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class AlbumAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<IAlbum> | null = null;
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
    private oAlbumService: AlbumService,
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
    this.oAlbumService
      .getPage(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro
      )
      .subscribe({
        next: (oPageFromServer: IPage<IAlbum>) => {
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

  edit(oAlbum: IAlbum) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/album/edit', oAlbum.id]);
  }

  view(oAlbum: IAlbum) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/album/view', oAlbum.id]);
  }

  remove(oAlbum: IAlbum) {
    this.oRouter.navigate(['admin/album/delete/', oAlbum.id]);
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

