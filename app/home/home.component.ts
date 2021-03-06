import { Component } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'home',
	template: `
		<record-list [resource]="'http://localhost:3001/users'" [searchables]="searchables" [config]="{ route: 'edit' }"></record-list>
	`,
	styleUrls: [ 'home.component.css' ]
})
export class HomeComponent {
	searchables: any = [
		{ record: 'username', label: 'Username' },
		{ record: 'first_name', label: 'First Name' },
		{ record: 'last_name', label: 'Last Name' },
		{ record: 'email', label: 'Email' },
		{ record: 'phone', label: 'Phone' }
	]
}