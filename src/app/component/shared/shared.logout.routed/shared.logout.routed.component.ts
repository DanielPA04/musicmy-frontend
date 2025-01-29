import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../service/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shared.logout.routed',
  templateUrl: './shared.logout.routed.component.html',
  styleUrls: ['./shared.logout.routed.component.css']
})
export class SharedLogoutRoutedComponent implements OnInit {

  constructor(
    private oSessionService: SessionService,
    private oRouter: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.oSessionService.logout();    
    this.oRouter.navigate(['/']);
  }

  onCancel() {
    this.oRouter.navigate(['/']);
  }


}
