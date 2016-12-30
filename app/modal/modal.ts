import { Component, NgModule, Input, ViewChild, Output, EventEmitter, Injectable, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostListener } from '@angular/core';
import * as components from '../../components/index';
import { Subject } from 'rxjs/Subject';

let componentsArray: any[] = Object.values(components);

@Injectable()
export class ModalService {
	currentComponent = null;
	instanceOf = null;
	modalSrc = new Subject<any>();
	modalStream = this.modalSrc.asObservable();
	modals: any = [];

	open(data){
		this.modalSrc.next({ state: 'open', data: data });
	}

	close(){
		this.modalSrc.next({ state: 'closed', data: this.currentComponent });
	}

}

@Component({
	selector: 'dynamic-component',
	entryComponents: componentsArray,
	template: `
		<div #dynamic></div>
	`
})
export class DynamicComponent {
	currentComponent = null;
	@ViewChild('dynamic', { read: ViewContainerRef }) dynamic: ViewContainerRef;

	// component: Class for the component you want to create
	// inputs: An object with key/value pairs mapped to input name/input value
	@Input() set componentData(data: {component: any, inputs: any }) {

		if (!data) { return; } 

		// Inputs need to be in the following format to be resolved properly
		let inputProviders: any;
		if( data.inputs ){
			inputProviders = Object.keys(data.inputs).map((inputName) => {return { provide: inputName, useValue: data.inputs[inputName] };});	
		}else{
			inputProviders = [];
		}
		inputProviders.push({ provide: 'modal', useValue: true });

		let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

		// We create an injector out of the data we want to pass down and this components injector
		let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamic.parentInjector);

		// We create a factory out of the component we want to create
		let factory = this.resolver.resolveComponentFactory(data.component);

		// We create the component using the factory and the injector
		let component = factory.create(injector);

		// We insert the component into the dom container
		this.dynamic.insert(component.hostView);

		// Destroy the previously created component
		if (this.currentComponent) {
		  this.currentComponent.destroy();
		}

		this.modalService.currentComponent = component;
	}

	constructor( 
		private resolver: ComponentFactoryResolver,
		private modalService: ModalService ){

	}

}

@Component({
	moduleId: module.id,
	selector: 'modal',
	styleUrls: [ 'modal.component.css' ],
	template: `
		<div class="stage" *ngIf="active" (modalClose)="close()">
			<div class="click-capture" (click)="close()"></div>
			<div class="content-wrapper">
				<i icon="cross" (click)="close()"></i>
				<div class="content">
					<dynamic-component #dynamicContent [componentData]="data"></dynamic-component>
				</div>
			</div>
		</div>
	`
})
export class ModalComponent {
	@ViewChild('dynamicContent') dynamicContent;
	data: any;
	active = false;
	@HostListener('document:keydown', ['$event'])
    keyDown(e: KeyboardEvent) {
    	if( this.active && e.keyCode === 27 ) this.modalService.close();
    }

	constructor(
		private modalService: ModalService,
		private resolver: ComponentFactoryResolver ){
		this.modalService.modalStream.subscribe(modal => { 
			if( modal.state == 'open' ){
				this.data = modal.data;
				this.active = true;
			}
			if( modal.state == 'closed'){
				this.active = false;
			}
		});
	}

	//Putting these here so you can access the methods from the view.
	open(data){
		this.modalService.open(data);
	}

	close(){
		this.modalService.close();
	}

}

@NgModule({
	providers: [ ModalService ],
	imports: [ CommonModule ],
	declarations: [ ModalComponent, DynamicComponent ],
	bootstrap: [ ModalComponent ],
	exports: [ ModalComponent ]
})
export class ModalModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ModalComponent,
			providers: [ ModalService ]
		}
	}
}