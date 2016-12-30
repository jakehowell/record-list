import { Component } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'app',
	template: `
		<nav></nav>
		<main><router-outlet></router-outlet></main>
	`
})
export class AppComponent {
	
}