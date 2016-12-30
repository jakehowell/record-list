import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './components/index';
import { HomeComponent } from './home/home.component';
export const ROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'edit/:id', component: EditComponent }
]