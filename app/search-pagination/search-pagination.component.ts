import { Component, EventEmitter, Input, Output, ViewEncapsulation, ViewChild, QueryList, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
	moduleId: module.id,
	selector: 'search-pagination',
	templateUrl: 'search-pagination.component.html',
	styleUrls: [ 'search-pagination.component.css' ],
	encapsulation: ViewEncapsulation.None
})
export class SearchPaginationComponent implements AfterViewInit {
	@Input() filterOn: string;
	@Input() results: Observable<any>;
	@Output() updateResults = new EventEmitter<any>(true);
	currentPage: number = 1;
	loading: boolean = false;
	timeout: any;
	updatesSource = new Subject<any>();
	updates = this.updatesSource.asObservable();
	pages = [];
	pagination = {
		page_count: 0,
		current_page: 1
	};

	constructor(){}

	ngAfterViewInit(){
		this.results.subscribe( pages => {
			this.pagination = pages;
			for( var i = 0; i < this.pagination.page_count; i++ ){
				this.pages[i] = { number: i + 1 };
			}
		})
	}
	
	sendQuery(query){
		this.updatesSource.next(query);
	}

	//Handle typing in search field
	handleInput(event){
		clearTimeout(this.timeout);
		this.timeout = null;
		this.timeout = setTimeout(() => {
			var query, filterString;
			var value = event.target.value;
			if( !value || value == '' ){ value = false; }
			if( this.filterOn.match(/filters/gi) && this.filterOn.match(/filters/gi).length ){
				filterString = `${this.filterOn}[op]=llike&${this.filterOn}[value]=${value}`;
			}
			if( this.filterOn.match(/matching/gi) && this.filterOn.match(/matching/gi).length ){
				filterString = `${this.filterOn}=${value}`;
			}
			if( this.filterOn.match(/map/gi) && this.filterOn.match(/map/gi).length ){
				filterString = { map: this.filterOn.match(/(?!map\[)([a-zA-Z_]+)(?=\])/gi)[0], value: value };
			}
			query = value ? filterString : {};
			this.sendQuery(query);
			this.updateResults.emit(query);
		}, 500);
		
	}

	//Handle click on specific page number
	handleGoToPage(page){
		var query = `page=${page}`;
		this.sendQuery(query);
	}

	//Handle click on prev page button
	handlePrevPage(){
		var query = `page=${this.pagination.current_page - 1}`;
		this.sendQuery(query);
	}

	//Handle click on next page button
	handleNextPage(){
		var query = `page=${this.pagination.current_page + 1 }`;
		this.sendQuery(query);
	}

}