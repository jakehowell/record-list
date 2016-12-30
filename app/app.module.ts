import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ModalComponent, ModalService, DynamicComponent } from './modal/modal';
import { AppComponent } from './app.component';
import { EditComponent } from './components/index';
import { HomeComponent } from './home/home.component';
import { RecordListComponent } from './record-list/record-list.component';
import { SearchPaginationComponent } from './search-pagination/search-pagination.component';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ApiMockDataService }  from './services/api-mock-data.service';

import { ROUTES } from './app.routes';

@NgModule ({
	imports: [ 
		BrowserModule,
		HttpModule,
		FormsModule,
		//InMemoryWebApiModule.forRoot(ApiMockDataService),
		RouterModule.forRoot(ROUTES),
		MaterialModule.forRoot()
	],
	declarations: [
		AppComponent,
		HomeComponent,
		ModalComponent,
		DynamicComponent,
		EditComponent,
		RecordListComponent,
		SearchPaginationComponent
	],
	providers: [
		Title,
		ModalService
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }