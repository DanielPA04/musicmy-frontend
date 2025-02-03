import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IAlbum } from '../../../model/album.interface';
import { BlobToUrlPipe } from '../../../pipe/blob.pipe';

@Component({
  selector: 'app-shared-table-unrouted',
  templateUrl: './shared.table.unrouted.component.html',
  styleUrls: ['./shared.table.unrouted.component.css'],
  standalone: true, 
  imports: [BlobToUrlPipe],
})
export class SharedTableUnroutedComponent implements OnInit {

  @Input() oAlbum:IAlbum = {} as IAlbum;

  constructor(private oRouter: Router) { }

  ngOnInit() {
  }




}
