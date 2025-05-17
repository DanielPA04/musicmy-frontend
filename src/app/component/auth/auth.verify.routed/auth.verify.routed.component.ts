import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { SessionService } from '../../../service/session.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedSpinnerUnroutedComponent } from '../../shared/shared.spinner.unrouted/shared.spinner.unrouted.component';

@Component({
  selector: 'app-shared-verify-routed',
  templateUrl: './shared.verify.routed.component.html',
  styleUrls: ['./shared.verify.routed.component.css'],
  imports: [MatProgressSpinnerModule],
})
export class AuthVerifyRoutedComponent implements OnInit {
  token: string = '';
  success: boolean = false;
  isError: boolean = false;

  dialogRef!: MatDialogRef<SharedSpinnerUnroutedComponent>;
  private startTime: number = 0; // << añadimos el tiempo de inicio

  constructor(
    private oActivedRoute: ActivatedRoute,
    private oAuthService: AuthService,
    private oRouter: Router,
    private oSessionService: SessionService,
    private dialog: MatDialog
  ) {
    this.token = this.oActivedRoute.snapshot.params['token'];
  }

  ngOnInit(): void {
    this.dialogRef = this.dialog.open(SharedSpinnerUnroutedComponent, {
      disableClose: true,
      panelClass: 'transparent-dialog',
    });

    this.startTime = Date.now(); // << guardamos cuando abrimos el spinner

    this.verificarToken();
  }

  private verificarToken(): void {
    let intentos = 0;

    const verificar = () => {
      this.oAuthService.verify(this.token).subscribe({
        next: (data: string) => {
          this.oSessionService.login(data);
          this.success = true;

          this.closeSpinnerAndNavigate();
        },
        error: (err) => {
          console.log(err);
          if (intentos < 2) {
            intentos++;
            verificar();
          } else {
            this.isError = true;
            this.closeSpinnerAndNavigate();
          }
        },
      });
    };
    verificar();
  }

  private closeSpinnerAndNavigate(): void {
    const elapsed = Date.now() - this.startTime;
    const minDuration = 1000; // 1 segundo

    const delay = elapsed < minDuration ? minDuration - elapsed : 0;

    setTimeout(() => {
      if (this.dialogRef) {
        this.dialogRef.close();
      }

      setTimeout(() => {
        this.oRouter.navigate(['/']);
      }, 5000);
    }, delay);
  }

  private closeSpinner(): void {
    const elapsed = Date.now() - this.startTime;
    const minDuration = 1000; // 1 segundo

    const delay = elapsed < minDuration ? minDuration - elapsed : 0;

    setTimeout(() => {
      if (this.dialogRef) {
        this.dialogRef.close();
      }
    }, delay);
  }
}
