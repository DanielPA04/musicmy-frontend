import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-shared.spinner.unrouted',
  standalone: true,
  templateUrl: './shared.spinner.unrouted.component.html',
  styleUrls: ['./shared.spinner.unrouted.component.css'],
  imports: [MatProgressSpinnerModule],
})
export class SharedSpinnerUnroutedComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
