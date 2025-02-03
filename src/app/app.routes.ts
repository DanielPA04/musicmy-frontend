import { Routes } from '@angular/router';

//Guards
import { AdminGuard } from './guard/admin.guard';

//Menu
import { SharedHomeRoutedComponent } from './component/shared/shared.home.routed/shared.home.routed.component';
import { SharedLoginRoutedComponent } from './component/shared/shared.login.routed/shared.login.routed.component';
import { SharedLogoutRoutedComponent } from './component/shared/shared.logout.routed/shared.logout.routed.component';
import { SharedPerfilRoutedComponent } from './component/shared/shared.perfil.routed/shared.perfil.routed.component';

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





export const routes: Routes = [
    // Menu
    { path: '', component: SharedHomeRoutedComponent },
    { path: 'home', component: SharedHomeRoutedComponent },
    { path: 'login', component: SharedLoginRoutedComponent },
    { path: 'logout', component: SharedLogoutRoutedComponent },
    { path: 'perfil/:email', component: SharedPerfilRoutedComponent },

    //Album
    { path: 'admin/album/plist', component: AlbumAdminPlistRoutedComponent },
    { path: 'admin/album/create', component: AlbumAdminCreateRoutedComponent },
    { path: 'admin/album/view/:id', component: AlbumAdminViewRoutedComponent },
    { path: 'admin/album/edit/:id', component: AlbumAdminEditRoutedComponent },
    { path: 'admin/album/delete/:id', component: AlbumAdminDeleteRoutedComponent },

    //Artista
    { path: 'admin/artista/plist', component: ArtistaAdminPlistRoutedComponent },
    { path: 'admin/artista/create', component: ArtistaAdminCreateRoutedComponent, canActivate: [AdminGuard] },
    { path: 'admin/artista/view/:id', component: ArtistaAdminViewRoutedComponent },
    { path: 'admin/artista/edit/:id', component: ArtistaAdminEditRoutedComponent },
    { path: 'admin/artista/delete/:id', component: ArtistaAdminDeleteRoutedComponent },

     //Resenya
     { path: 'admin/resenya/plist', component: ResenyaAdminPlistRoutedComponent },
     { path: 'admin/resenya/create', component: ResenyaAdminCreateRoutedComponent},
     { path: 'admin/resenya/view/:id', component: ResenyaAdminViewRoutedComponent },
     { path: 'admin/resenya/edit/:id', component: ResenyaAdminEditRoutedComponent },
     { path: 'admin/resenya/delete/:id', component: ResenyaAdminDeleteRoutedComponent },


];
