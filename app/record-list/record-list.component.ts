import { AfterViewInit, Component, Directive, Injectable, Input, Output, OnInit, EventEmitter, ViewChild, ChangeDetectorRef, ViewEncapsulation, forwardRef, ContentChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ModalService } from '../modal/modal';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';

@Component({
	moduleId: module.id,
	selector: 'record-list',
	template: `
		<search-pagination #search [filterOn]="searchBy" [results]="results">
			<select [(ngModel)]="searchBy">
				<option *ngFor="let option of searchables" [value]="parseValue(option)">{{ option.label }}</option>
			</select>
		</search-pagination>
		<div class="spinner" *ngIf="loading">
			<md-spinner></md-spinner>
		</div>
		<div class="flex-table">
			<div class="flex-row flex-table-header">
				<div class="flex-column" *ngFor="let viewable of viewables" [ngClass]="viewable.record" [attr.sort]="sorting[viewable.record]" (click)="handleSort(viewable)">
					{{ viewable.label }}
				</div>
			</div>
			<div *ngIf="!loading">
				<div class="flex-row" *ngFor="let record of records" (click)="handleRecordClick(record.id)">
					<div class="flex-column" *ngFor="let item of keys(record)" [ngClass]="item" [attr.show]="show(item)">
						<img *ngIf="record[item] && record[item].mediaType == 'image'" [src]="record[item].src">
						<span [innerHTML]="( record[item] && record[item].mediaType ? '' : record[item] )"></span>
					</div>
				</div>
			</div>
		</div>
		<modal #modal></modal>
	`,
	styleUrls: [ 'record-list.component.css' ]
})
export class RecordListComponent implements AfterViewInit, OnInit {
	@ViewChild('search') search;
	@ViewChild('modal') modal;
	@Input('resource') resource;
	@Input('searchables') searchables;
	@Input('config') config;
	viewables:any = []
	searchBy: any;
	sorting = {};
	loading: boolean = true;
	records: any = [];
	savedQuery: any;

	//Observables
	resultsSource = new Subject<any>();
	results = this.resultsSource.asObservable();
	sortSource = new Subject<any>();
	sort = this.sortSource.asObservable();

	constructor( 
		private http: Http,
		private cdr: ChangeDetectorRef,
		//private notifications: NotificationService,
		private router: Router,
		private modalService: ModalService ){
	}

	serialize(obj) {
		var str = [];
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
		}
		return str.join('&');
	}

	ngOnInit(){
		var $this = this;
		this.config = this.config || {};

		this.config.defaultQuery = this.config.defaultQuery || '';

		if(this.config.openInModal){
			this.modalService.modalStream.subscribe(modal => {
				if( modal.state == 'closed' && modal.data.instance instanceof this.config.openInModal.component ){
					this.getResource(this.resource);
				}
			})
		}

		//Always able to view and search by ID
		var idInSearchables = !!this.searchables.find(function(searchable){ 
			return searchable.record == 'id';
		});
		if(!idInSearchables){
			this.searchables.unshift({ label: 'ID', record: 'id', searchableOnly: 'true' });
		}
	
		//Filter out searchableOnly columns
		this.viewables = this.searchables.filter(function(viewable, index){
			return !viewable.searchableOnly;
		});

		//Filter out viewableOnly columns
		this.searchables = this.searchables.filter(function(searchable, index){
			return !searchable.viewableOnly;
		});

		//Set default value
		var name = this.searchables.find(function(value, index, array){ return value.label == 'Name' });
		this.searchBy = name ? `filters[${name.record}]` : this.parseValue( this.searchables[1] );

		this.cdr.detectChanges();
	}

	ngAfterViewInit(){
		var $this = this;

		//Setup search subscription
		this.search.updates.subscribe(query => {
			var valid = typeof query == 'string' || typeof query == 'object' && Object.keys(query).length;
			switch(true){
				case valid && typeof query == 'string':
					this.savedQuery = query;
					break;

				case valid && typeof query == 'object':
					query = this.convertMapping(query);
					this.savedQuery = query;
					break;

				case !valid:
					query = '';
					break;
			}
			this.getResource(this.resource, query);
		});

		//Setup sort subscription
		this.sort.subscribe(query => {
			this.getResource(this.resource, query);
		});

		//Get Records
		this.getResource(this.resource);

		this.cdr.detectChanges();

	}

	//API call
	getResource(path, data?){
		var $this = this;
		var headers = new Headers();
		var params;
		var options;
		headers.append('accept', 'application/json');

		data = data || {};

		//Handle both Objects and Strings for params
		if(typeof data == 'string'){
			params = data;
		}else if(typeof data == 'object'){
			params = this.serialize(data);
		}

		switch(true){
			case !!params && !!this.config.defaultQuery:
				options = `${this.config.defaultQuery}&${params}`
				break;

			case !!params && !!!this.config.defaultQuery:
				options = params;
				break;

			case !!!params && !!this.config.defaultQuery:
				options = this.config.defaultQuery;
				break;

			default:
				options = '';
				break;
		}

		//Check for contains and add it to query
		var containsIndex = 0;
		this.searchables.map(function(searchable){
			if( searchable.contains ){
				if( options.length && containsIndex == 0 || containsIndex > 0 ){ options += '&'; }
				options += `contains[${containsIndex}]=${searchable.contains.model}`;
				containsIndex++;
			}
		})

		//Hide table rows
		this.loading = true;

		return this.http.get(path + '?' + options, { headers: headers })
			.toPromise()
			.then(response => {
				var results = response.json();

				//Send pagination data to search component
				results.pagination ? this.resultsSource.next(results.pagination) : false;

				//Swap out compound values
				this.records = this.formatData(results.data);

				//Show table rows
				this.loading = false;
			})
			.catch( error => { 
				console.error(error);
			});
	}

	//Hide record if not in viewables
	show(record){
		var show = this.viewables.find(function(element){
			return element.record == record;
		});
		return !!show;
	}

	handleRecordClick(id){
		if(this.config.openInModal){
			let modal = this.config.openInModal.modal ? this.config.openInModal.modal : this.modal;
			var inputs = this.config.openInModal.inputs;
			inputs.id = id;
			modal.open({ component: this.config.openInModal.component, inputs: inputs })
		}else{
			let currentUrl = this.router.url;
			let route = this.config.route ? `${this.config.route}/${id}` : `${currentUrl}/${id}`;
			this.router.navigateByUrl(route);
		}
	}

	//Making Object.keys available in template
	keys(obj){
		return Object.keys(obj);
	}

	parseValue(option){
		var value;
		switch(true){
			case !!option.contains:
				value = `matching[${option.contains.model}.${option.contains.replaceWith}]`;
				break;

			case !!option.map:
				value = `map[${option.record}]`;
			break;

			default:
				value = `filters[${option.record}]`;
				break;
		}
		return value;
	}

	//Handle table header click
	handleSort(viewable){
		var $this = this;
		var savedQuery = this.savedQuery || false;
		var queryString = '';
		var query;
		var record;

		record = viewable.contains ? `${viewable.contains.model}.${viewable.contains.replaceWith}` : viewable.record;

		//If already sorting on column clicked return current sorting otherwise clear sorting
		this.sorting = this.sorting[viewable.record] ? this.sorting : {};
		
		//Toggle ascending/descending
		this.sorting[record] = this.sorting[record] == 'ASC' ? 'DESC' : 'ASC';

		//Generate query string
		Object.keys(this.sorting)
			.map(function(record){
				queryString += `order[${record}]=${$this.sorting[record]}`;
			});

		//If search has been done then sort the search results, otherwise send sort query by itself
		query = this.savedQuery ? this.savedQuery + `&${queryString}` : queryString;

		this.sortSource.next(query);

	}

	formatData(rows){
		var $this = this;
		var output;
		output = rows.map(function(record, index, array){

			//Format any contains data
			$this.searchables.map(function(searchable){
				if(record[searchable.record] && searchable.contains && record[searchable.contains.key]){
					record[searchable.record] = record[searchable.contains.key][searchable.contains.replaceWith];	
				}
			});

			//Check for mediaType 
			$this.viewables.map(function(viewable){
				if( record[viewable.record] && viewable.mediaType ){
					record[viewable.record] = { mediaType: viewable.mediaType, src: record[viewable.record] };
				}
				if( viewable.parseAs ){
					switch(viewable.parseAs){
						case 'date':
							var date = new Date(record[viewable.record]);
							record[viewable.record] = date.toLocaleDateString();
							break;

						case 'boolean':
							record[viewable.record] = record[viewable.record] ? 'Yes' : 'No';
							break;

						case 'mapping':
							var map = viewable.map;
							record[viewable.record] = map[record[viewable.record]];
							break;
					}
				}
			});

			//return record;
			return $this.sortToViewable(record);

		});
		return output;
	}

	//Reorder fields that are not in viewables object;
	sortToViewable(record){
		var $this = this;
		var obj = {};
		
		var fields = $this.viewables.map(function(element){ 
			return element.record;
		});
		
		fields.forEach(function(element){
			obj[element] = record[element];
		});

		Object.assign( obj, record );

		return obj;
	}

	//Return mapped values
	convertMapping(query){
		var output;
		var map = this.searchBy.match(/(?!map\[)([a-zA-Z_]+)(?=\])/gi)[0];
		if(map){
			output = '';

			//Get viewable
			var viewable = this.viewables.find(function(viewable){
				return viewable.record == map;
			});
			
			//Get keys in viewable.map
			var keys = Object.keys(viewable.map);
			
			//Search keys for search input value and return the index
			var search = keys.filter(function(key, index, array){
				var exp = new RegExp(query.value, 'gi');
				if( viewable.map[key].match(exp) && viewable.map[key].match(exp).length ){
					return index;
				}
			});

			//Build the query
			search.map(function(value, index, array){
				output += `filters[${query.map}][]=${value}`
				if(array.length > 1 && index < array.length-1){
					output += '&';
				}
			});

		}else{
			//If search option is not 
			output = query;
		}
		return output;
	}

}