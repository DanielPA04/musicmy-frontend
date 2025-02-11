import { Component, inject, OnInit } from '@angular/core';
import { AlbumService } from '../../../service/album.service';
import { IAlbum } from '../../../model/album.interface';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../environment/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BlobToUrlPipe } from '../../../pipe/blob.pipe';

@Component({
  selector: 'app-album.admin.mulselector.unrouted',
  standalone: true,
  templateUrl: './album.admin.mulselector.unrouted.component.html',
  styleUrls: ['./album.admin.mulselector.unrouted.component.css'],
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule, BlobToUrlPipe],
})
export class AlbumAdminMulselectorUnroutedComponent implements OnInit {
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
  //
  albumes: IAlbum[] = [];
  readonly dialogRef = inject(MatDialogRef<AlbumAdminMulselectorUnroutedComponent>);
  readonly data = inject(MAT_DIALOG_DATA);


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

          this.oPage.content.forEach((oAlbum) => {
            this.oAlbumService.getImg(oAlbum.id).subscribe({
              next: (data) => {
                oAlbum.img = data;
              },
            });

          });




        },
        error: (err) => {
          console.log(err);
        },
      });
  }


  checked(oAlbum: IAlbum) {
    this.albumes.push(oAlbum);
  }

  unckecked(oAlbum: IAlbum) {
    this.albumes = this.albumes.filter((o) => o.id !== oAlbum.id);
  }

  isChecked(albumId: number): boolean {
    return this.albumes.find((album) => album.id === albumId) !== undefined;
   
  }

  onCheckboxChange(event: Event, artista: IAlbum) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checked(artista);
    } else {
      this.unckecked(artista);
    }
  }

  select() {
    this.dialogRef.close(this.albumes);
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

