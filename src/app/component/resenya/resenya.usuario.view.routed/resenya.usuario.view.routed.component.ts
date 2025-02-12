import { Component, OnInit } from '@angular/core';
import { IResenya } from '../../../model/resenya.interface';
import { ActivatedRoute } from '@angular/router';
import { ResenyaService } from '../../../service/resenya.service';

@Component({
  selector: 'app-resenya.usuario.view.routed',
  templateUrl: './resenya.usuario.view.routed.component.html',
  styleUrls: ['./resenya.usuario.view.routed.component.css']
})
export class ResenyaUsuarioViewRoutedComponent implements OnInit {

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
