import { Routes } from '@angular/router';

//Guards
import { AdminGuard } from './guard/admin.guard';
import { NoUserGuard } from './guard/nouser.guard';
import { UserGuard } from './guard/user.guard';

//Menu
import { SharedHomeRoutedComponent } from './component/shared/shared.home.routed/shared.home.routed.component';
import { SharedLoginRoutedComponent } from './component/shared/shared.login.routed/shared.login.routed.component';
import { SharedLogoutRoutedComponent } from './component/shared/shared.logout.routed/shared.logout.routed.component';
import { SharedPerfilRoutedComponent } from './component/shared/shared.perfil.routed/shared.perfil.routed.component';
import { SharedRegisterRoutedComponent } from './component/shared/shared.register.routed/shared.register.routed.component';


//Album
import { AlbumAdminPlistRoutedComponent } from './component/album/album.admin.plist.routed/album.admin.plist.routed.component';
import { AlbumAdminCreateRoutedComponent } from './component/album/album.admin.create.routed/album.admin.create.routed.component';
import { AlbumAdminViewRoutedComponent } from './component/album/album.admin.view.routed/album.admin.view.routed.component';
import { AlbumAdminEditRoutedComponent } from './component/album/album.admin.edit.routed/album.admin.edit.routed.component';
import { AlbumAdminDeleteRoutedComponent } from './component/album/album.admin.delete.routed/album.admin.delete.routed.component';

//Artista
import { ArtistaAdminPlistRoutedComponent } from './component/artista/artista.admin.plist.routed/artista.admin.plist.routed.component';
import { ArtistaAdminCreateRoutedComponent } from './component/artista/artista.admin.create.routed/artista.admin.create.routed.component';
import { ArtistaAdminViewRoutedComponent } from './component/artista/artista.admin.view.routed/artista.admin.view.routed.component';
import { ArtistaAdminDeleteRoutedComponent } from './component/artista/artista.admin.delete.routed/artista.admin.delete.routed.component';
import { ArtistaAdminEditRoutedComponent } from './component/artista/artista.admin.edit.routed/artista.admin.edit.routed.component';

//Resenya
import { ResenyaAdminPlistRoutedComponent } from './component/resenya/resenya.admin.plist.routed/resenya.admin.plist.routed.component';
import { ResenyaAdminCreateRoutedComponent } from './component/resenya/resenya.admin.create.routed/resenya.admin.create.routed.component';
import { ResenyaAdminEditRoutedComponent } from './component/resenya/resenya.admin.edit.routed/resenya.admin.edit.routed.component';
import { ResenyaAdminDeleteRoutedComponent } from './component/resenya/resenya.admin.delete.routed/resenya.admin.delete.routed.component';
import { ResenyaAdminViewRoutedComponent } from './component/resenya/resenya.admin.view.routed/resenya.admin.view.routed.component';
import { UsuarioAdminPlistRoutedComponent } from './component/usuario/usuario.admin.plist.routed/usuario.admin.plist.routed.component';
import { UsuarioAdminCreateRoutedComponent } from './component/usuario/usuario.admin.create.routed/usuario.admin.create.routed.component';
import { UsuarioAdminViewRoutedComponent } from './component/usuario/usuario.admin.view.routed/usuario.admin.view.routed.component';
import { UsuarioAdminEditRoutedComponent } from './component/usuario/usuario.admin.edit.routed/usuario.admin.edit.routed.component';
import { UsuarioAdminDeleteRoutedComponent } from './component/usuario/usuario.admin.delete.routed/usuario.admin.delete.routed.component';

//Tipousuario
import { TipousuarioAdminPlistRoutedComponent } from './component/tipousuario/tipousuario.admin.plist.routed/tipousuario.admin.plist.routed.component';

export const routes: Routes = [
    // Menu
    { path: '', component: SharedHomeRoutedComponent },
    { path: 'home', component: SharedHomeRoutedComponent },
    { path: 'register', component: SharedRegisterRoutedComponent, canActivate: [NoUserGuard] },
    { path: 'login', component: SharedLoginRoutedComponent , canActivate: [NoUserGuard] },
    { path: 'logout', component: SharedLogoutRoutedComponent, canActivate: [UserGuard] },
    { path: 'perfil/:email', component: SharedPerfilRoutedComponent, canActivate: [UserGuard] },

    //Album
    { path: 'admin/album/plist', component: AlbumAdminPlistRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/album/create', component: AlbumAdminCreateRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/album/view/:id', component: AlbumAdminViewRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/album/edit/:id', component: AlbumAdminEditRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/album/delete/:id', component: AlbumAdminDeleteRoutedComponent, canActivate: [AdminGuard] },

    //Artista
    { path: 'admin/artista/plist', component: ArtistaAdminPlistRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/artista/create', component: ArtistaAdminCreateRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/artista/view/:id', component: ArtistaAdminViewRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/artista/edit/:id', component: ArtistaAdminEditRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/artista/delete/:id', component: ArtistaAdminDeleteRoutedComponent, canActivate: [AdminGuard] },

    //Resenya
    { path: 'admin/resenya/plist', component: ResenyaAdminPlistRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/resenya/create', component: ResenyaAdminCreateRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/resenya/view/:id', component: ResenyaAdminViewRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/resenya/edit/:id', component: ResenyaAdminEditRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/resenya/delete/:id', component: ResenyaAdminDeleteRoutedComponent, canActivate: [AdminGuard] },

     //Usuario
     { path: 'admin/usuario/plist', component: UsuarioAdminPlistRoutedComponent, canActivate: [AdminGuard] },
     { path: 'admin/usuario/create', component: UsuarioAdminCreateRoutedComponent, canActivate: [AdminGuard] },
     { path: 'admin/usuario/view/:id', component: UsuarioAdminViewRoutedComponent, canActivate: [AdminGuard] },
     { path: 'admin/usuario/edit/:id', component: UsuarioAdminEditRoutedComponent, canActivate: [AdminGuard] },
     { path: 'admin/usuario/delete/:id', component: UsuarioAdminDeleteRoutedComponent, canActivate: [AdminGuard] },

     //Tipousuario
     { path: 'admin/tipousuario/plist', component: TipousuarioAdminPlistRoutedComponent, canActivate: [AdminGuard] },


];
