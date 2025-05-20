import { Routes } from '@angular/router';
//Guards
import { AdminGuard } from './guard/admin.guard';
import { NoUserGuard } from './guard/nouser.guard';
import { UserGuard } from './guard/user.guard';
//Menu
import { SharedHomeRoutedComponent } from './component/shared/shared.home.routed/shared.home.routed.component';
import { AuthLogoutRoutedComponent } from './component/auth/auth.logout.routed/auth.logout.routed.component';
import { SharedPerfilRoutedComponent } from './component/shared/shared.perfil.routed/shared.perfil.routed.component';
import { AuthRegisterRoutedComponent } from './component/auth/auth.register.routed/auth.register.routed.component';
//Auth
import { AuthVerifyRoutedComponent } from './component/auth/auth.verify.routed/auth.verify.routed.component';
import { AuthLoginRoutedComponent } from './component/auth/auth.login.routed/auth.login.routed.component';
import { AuthForgotPwdComponent } from './component/auth/auth.forgot.pwd/auth.forgot.pwd.component';
import { AuthPwdTokenComponent } from './component/auth/auth.pwd.token/auth.pwd.token.component';
//Album
import { AlbumAdminPlistRoutedComponent } from './component/album/album.admin.plist.routed/album.admin.plist.routed.component';
import { AlbumAdminCreateRoutedComponent } from './component/album/album.admin.create.routed/album.admin.create.routed.component';
import { AlbumAdminViewRoutedComponent } from './component/album/album.admin.view.routed/album.admin.view.routed.component';
import { AlbumAdminEditRoutedComponent } from './component/album/album.admin.edit.routed/album.admin.edit.routed.component';
import { AlbumAdminDeleteRoutedComponent } from './component/album/album.admin.delete.routed/album.admin.delete.routed.component';
import { AlbumUsuarioViewRoutedComponent } from './component/album/album.usuario.view.routed/album.usuario.view.routed.component';
//Artista
import { ArtistaAdminPlistRoutedComponent } from './component/artista/artista.admin.plist.routed/artista.admin.plist.routed.component';
import { ArtistaAdminCreateRoutedComponent } from './component/artista/artista.admin.create.routed/artista.admin.create.routed.component';
import { ArtistaAdminViewRoutedComponent } from './component/artista/artista.admin.view.routed/artista.admin.view.routed.component';
import { ArtistaAdminDeleteRoutedComponent } from './component/artista/artista.admin.delete.routed/artista.admin.delete.routed.component';
import { ArtistaAdminEditRoutedComponent } from './component/artista/artista.admin.edit.routed/artista.admin.edit.routed.component';
import { ArtistaUsuarioViewRoutedComponent } from './component/artista/artista.usuario.view.routed/artista.usuario.view.routed.component';
//Resenya
import { ResenyaAdminPlistRoutedComponent } from './component/resenya/resenya.admin.plist.routed/resenya.admin.plist.routed.component';
import { ResenyaAdminCreateRoutedComponent } from './component/resenya/resenya.admin.create.routed/resenya.admin.create.routed.component';
import { ResenyaAdminEditRoutedComponent } from './component/resenya/resenya.admin.edit.routed/resenya.admin.edit.routed.component';
import { ResenyaAdminDeleteRoutedComponent } from './component/resenya/resenya.admin.delete.routed/resenya.admin.delete.routed.component';
import { ResenyaAdminViewRoutedComponent } from './component/resenya/resenya.admin.view.routed/resenya.admin.view.routed.component';
import { ResenyaUsuarioCreateRoutedComponent } from './component/resenya/resenya.usuario.create.routed/resenya.usuario.create.routed.component';
// Usuario
import { UsuarioPerfilEditRoutedComponent } from './component/usuario/usuario.perfil.edit.routed/usuario.perfil.edit.routed.component';
import { UsuarioAdminPlistRoutedComponent } from './component/usuario/usuario.admin.plist.routed/usuario.admin.plist.routed.component';
import { UsuarioAdminCreateRoutedComponent } from './component/usuario/usuario.admin.create.routed/usuario.admin.create.routed.component';
import { UsuarioAdminViewRoutedComponent } from './component/usuario/usuario.admin.view.routed/usuario.admin.view.routed.component';
import { UsuarioAdminEditRoutedComponent } from './component/usuario/usuario.admin.edit.routed/usuario.admin.edit.routed.component';
import { UsuarioAdminDeleteRoutedComponent } from './component/usuario/usuario.admin.delete.routed/usuario.admin.delete.routed.component';
//Tipousuario
import { TipousuarioAdminPlistRoutedComponent } from './component/tipousuario/tipousuario.admin.plist.routed/tipousuario.admin.plist.routed.component';
import { UsuarioPerfilAllresenyasRoutedComponent } from './component/usuario/usuario.perfil.allresenyas.routed/usuario.perfil.allresenyas.routed.component';
import { UsuarioTopRoutedComponent } from './component/usuario/usuario.top.routed/usuario.top.routed.component';
import { AlbumFilterRoutedComponent } from './component/album/album.filter.routed/album.filter.routed.component';
import { ArtistaFilterRoutedComponent } from './component/artista/artista.filter.routed/artista.filter.routed.component';
//





export const routes: Routes = [
    // Menu/Shared
    { path: '', component: SharedHomeRoutedComponent },
    { path: 'home', component: SharedHomeRoutedComponent },
    { path: 'register', component: AuthRegisterRoutedComponent, canActivate: [NoUserGuard] },
    { path: 'login', component: AuthLoginRoutedComponent , canActivate: [NoUserGuard] },
    { path: 'logout', component: AuthLogoutRoutedComponent, canActivate: [UserGuard] },
    { path: 'perfil/:email', component: SharedPerfilRoutedComponent },
    { path: 'verify/:token', component: AuthVerifyRoutedComponent, canActivate: [NoUserGuard], data: { hideHeaderFooter: true } },

    //Auth
    { path: 'forgot-password', component: AuthForgotPwdComponent, canActivate: [NoUserGuard] },
    { path: 'reset-password/:token', component: AuthPwdTokenComponent, canActivate: [NoUserGuard], data: { hideHeaderFooter: true } },



    //Album
    { path: 'admin/album/plist', component: AlbumAdminPlistRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/album/create', component: AlbumAdminCreateRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/album/view/:id', component: AlbumAdminViewRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/album/edit/:id', component: AlbumAdminEditRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/album/delete/:id', component: AlbumAdminDeleteRoutedComponent, canActivate: [AdminGuard] },
    { path: 'album/view/:id', component: AlbumUsuarioViewRoutedComponent },
    { path: 'album', component: AlbumFilterRoutedComponent },


    //Artista
    { path: 'admin/artista/plist', component: ArtistaAdminPlistRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/artista/create', component: ArtistaAdminCreateRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/artista/view/:id', component: ArtistaAdminViewRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/artista/edit/:id', component: ArtistaAdminEditRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/artista/delete/:id', component: ArtistaAdminDeleteRoutedComponent, canActivate: [AdminGuard] },
    { path: 'artista/view/:id', component: ArtistaUsuarioViewRoutedComponent,  },
    { path: 'artista', component: ArtistaFilterRoutedComponent,  },


    //Resenya
    { path: 'admin/resenya/plist', component: ResenyaAdminPlistRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/resenya/create', component: ResenyaAdminCreateRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/resenya/view/:id', component: ResenyaAdminViewRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/resenya/edit/:id', component: ResenyaAdminEditRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/resenya/delete/:id', component: ResenyaAdminDeleteRoutedComponent, canActivate: [AdminGuard] },
    { path: 'resenya/create/:id', component: ResenyaUsuarioCreateRoutedComponent, canActivate: [UserGuard] },

     //Usuario
     { path: 'admin/usuario/plist', component: UsuarioAdminPlistRoutedComponent, canActivate: [AdminGuard] },
     { path: 'admin/usuario/create', component: UsuarioAdminCreateRoutedComponent, canActivate: [AdminGuard] },
     { path: 'admin/usuario/view/:id', component: UsuarioAdminViewRoutedComponent, canActivate: [AdminGuard] },
     { path: 'admin/usuario/edit/:id', component: UsuarioAdminEditRoutedComponent, canActivate: [AdminGuard] },
     { path: 'admin/usuario/delete/:id', component: UsuarioAdminDeleteRoutedComponent, canActivate: [AdminGuard] },
     { path: 'edit/perfil', component: UsuarioPerfilEditRoutedComponent, canActivate: [UserGuard] },
     { path: 'perfil/:email/resenyas', component: UsuarioPerfilAllresenyasRoutedComponent },
    { path: 'top-usuarios', component: UsuarioTopRoutedComponent },



     //Tipousuario
     { path: 'admin/tipousuario/plist', component: TipousuarioAdminPlistRoutedComponent, canActivate: [AdminGuard] },


];
