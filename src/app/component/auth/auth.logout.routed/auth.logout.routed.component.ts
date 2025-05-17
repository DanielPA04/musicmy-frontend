import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../service/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth.logout.routed',
  templateUrl: './auth.logout.routed.component.html',
  styleUrls: ['./auth.logout.routed.component.css']
})
export class AuthLogoutRoutedComponent implements OnInit {

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
