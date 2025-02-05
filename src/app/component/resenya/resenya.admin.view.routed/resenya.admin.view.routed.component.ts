import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResenyaService } from '../../../service/resenya.service';
import { IResenya } from '../../../model/resenya.interface';

@Component({
  selector: 'app-resenya.admin.view.routed',
  templateUrl: './resenya.admin.view.routed.component.html',
  standalone: true,
  styleUrls: ['./resenya.admin.view.routed.component.css'],
})
export class ResenyaAdminViewRoutedComponent implements OnInit {
  //
  id: number = 0;
  oResenya: IResenya = {} as IResenya;
  //
  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oResenyaService: ResenyaService
  ) {}

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.oResenyaService.get(this.id).subscribe({
      next: (data: IResenya) => {
        this.oResenya = data;
      },
    });
  }
}
