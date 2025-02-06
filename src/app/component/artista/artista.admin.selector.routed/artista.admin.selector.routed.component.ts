import { Component, inject, OnInit } from '@angular/core';
import { ArtistaService } from '../../../service/artista.service';
import { IArtista } from '../../../model/artista.interface';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../environment/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-artista.admin.selector.routed',
  standalone: true,
  templateUrl: './artista.admin.selector.routed.component.html',
  styleUrls: ['./artista.admin.selector.routed.component.css'],
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class ArtistaAdminSelectorRoutedComponent implements OnInit {
  oPage: IPage<IArtista> | null = null;
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
  artistas: IArtista[] = [];
  readonly dialogRef = inject(MatDialogRef<ArtistaAdminSelectorRoutedComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor(
    private oArtistaService: ArtistaService,
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
    this.oArtistaService
      .getPage(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro
      )
      .subscribe({
        next: (oPageFromServer: IPage<IArtista>) => {
          this.oPage = oPageFromServer;
          console.log(oPageFromServer.content[1].nombrereal);
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

  edit(oArtista: IArtista) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/artista/edit', oArtista.id]);
  }

  view(oArtista: IArtista) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/artista/view', oArtista.id]);
  }

  remove(oArtista: IArtista) {
    this.oRouter.navigate(['admin/artista/delete/', oArtista.id]);
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

  checked(oArtista: IArtista) {
    this.artistas.push(oArtista);
  }

  unckecked(oArtista: IArtista) {
    this.artistas = this.artistas.filter((o) => o.id !== oArtista.id);
  }

  isChecked(artistaId: number): boolean {
    return this.artistas.find((artista) => artista.id === artistaId) !== undefined;
   
  }

  onCheckboxChange(event: Event, artista: IArtista) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.checked(artista);
    } else {
      this.unckecked(artista);
    }
  }

  select() {
    this.dialogRef.close(this.artistas);
  }

}

