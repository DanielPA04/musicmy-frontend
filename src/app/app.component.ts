import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SharedMenuUnroutedComponent } from './component/shared/shared.menu.unrouted/shared.menu.unrouted.component';
import { initFlowbite } from 'flowbite';
import { filter, map, mergeMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedMenuUnroutedComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'musicmy-frontend';
  showLayout = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.showLayout = !(data['hideHeaderFooter'] ?? false);
    });
  }
   

  ngOnInit() {
    initFlowbite();
  }
}
