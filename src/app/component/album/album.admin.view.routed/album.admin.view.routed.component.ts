import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumService } from '../../../service/album.service';
import { IAlbum } from '../../../model/album.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { BlobToUrlPipe } from '../../../pipe/blob.pipe';

@Component({
  selector: 'app-album.admin.view.routed',
  templateUrl: './album.admin.view.routed.component.html',
  standalone: true,
  imports: [BlobToUrlPipe],
  styleUrls: ['./album.admin.view.routed.component.css'],
})
export class AlbumAdminViewRoutedComponent implements OnInit {
  //
  id: number = 0;
  oAlbum: IAlbum = {} as IAlbum;
  //
  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oAlbumService: AlbumService
  ) {}

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.oAlbumService.get(this.id).subscribe({
      next: (data: IAlbum) => {
        console.log(data);
        this.oAlbum = data;
        this.oAlbumService.getImg(this.oAlbum.id).subscribe({
          next: (data: Blob) => {
            this.oAlbum.img = data;
          },
        });
      },
    });
  }
}
