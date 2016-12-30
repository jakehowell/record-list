"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var components = require("../components/index");
var Subject_1 = require("rxjs/Subject");
var componentsArray = Object.values(components);
var ModalService = (function () {
    function ModalService() {
        this.currentComponent = null;
        this.instanceOf = null;
        this.modalSrc = new Subject_1.Subject();
        this.modalStream = this.modalSrc.asObservable();
        this.modals = [];
    }
    ModalService.prototype.open = function (data) {
        this.modalSrc.next({ state: 'open', data: data });
    };
    ModalService.prototype.close = function () {
        this.modalSrc.next({ state: 'closed', data: this.currentComponent });
    };
    return ModalService;
}());
ModalService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], ModalService);
exports.ModalService = ModalService;
var DynamicComponent = (function () {
    function DynamicComponent(resolver, modalService) {
        this.resolver = resolver;
        this.modalService = modalService;
        this.currentComponent = null;
    }
    Object.defineProperty(DynamicComponent.prototype, "componentData", {
        // component: Class for the component you want to create
        // inputs: An object with key/value pairs mapped to input name/input value
        set: function (data) {
            if (!data) {
                return;
            }
            // Inputs need to be in the following format to be resolved properly
            var inputProviders;
            if (data.inputs) {
                inputProviders = Object.keys(data.inputs).map(function (inputName) { return { provide: inputName, useValue: data.inputs[inputName] }; });
            }
            else {
                inputProviders = [];
            }
            inputProviders.push({ provide: 'modal', useValue: true });
            var resolvedInputs = core_1.ReflectiveInjector.resolve(inputProviders);
            // We create an injector out of the data we want to pass down and this components injector
            var injector = core_1.ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamic.parentInjector);
            // We create a factory out of the component we want to create
            var factory = this.resolver.resolveComponentFactory(data.component);
            // We create the component using the factory and the injector
            var component = factory.create(injector);
            // We insert the component into the dom container
            this.dynamic.insert(component.hostView);
            // Destroy the previously created component
            if (this.currentComponent) {
                this.currentComponent.destroy();
            }
            this.modalService.currentComponent = component;
        },
        enumerable: true,
        configurable: true
    });
    return DynamicComponent;
}());
__decorate([
    core_1.ViewChild('dynamic', { read: core_1.ViewContainerRef }),
    __metadata("design:type", typeof (_a = typeof core_1.ViewContainerRef !== "undefined" && core_1.ViewContainerRef) === "function" && _a || Object)
], DynamicComponent.prototype, "dynamic", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], DynamicComponent.prototype, "componentData", null);
DynamicComponent = __decorate([
    core_1.Component({
        selector: 'dynamic-component',
        entryComponents: componentsArray,
        template: "\n\t\t<div #dynamic></div>\n\t"
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof core_1.ComponentFactoryResolver !== "undefined" && core_1.ComponentFactoryResolver) === "function" && _b || Object, ModalService])
], DynamicComponent);
exports.DynamicComponent = DynamicComponent;
var ModalComponent = (function () {
    function ModalComponent(modalService, resolver) {
        var _this = this;
        this.modalService = modalService;
        this.resolver = resolver;
        this.active = false;
        this.modalService.modalStream.subscribe(function (modal) {
            if (modal.state == 'open') {
                _this.data = modal.data;
                _this.active = true;
            }
            if (modal.state == 'closed') {
                _this.active = false;
            }
        });
    }
    ModalComponent.prototype.keyDown = function (e) {
        if (this.active && e.keyCode === 27)
            this.modalService.close();
    };
    //Putting these here so you can access the methods from the view.
    ModalComponent.prototype.open = function (data) {
        this.modalService.open(data);
    };
    ModalComponent.prototype.close = function () {
        this.modalService.close();
    };
    return ModalComponent;
}());
__decorate([
    core_1.ViewChild('dynamicContent'),
    __metadata("design:type", Object)
], ModalComponent.prototype, "dynamicContent", void 0);
__decorate([
    core_2.HostListener('document:keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], ModalComponent.prototype, "keyDown", null);
ModalComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'modal',
        styleUrls: ['modal.component.css'],
        template: "\n\t\t<div class=\"stage\" *ngIf=\"active\" (modalClose)=\"close()\">\n\t\t\t<div class=\"click-capture\" (click)=\"close()\"></div>\n\t\t\t<div class=\"content-wrapper\">\n\t\t\t\t<i icon=\"cross\" (click)=\"close()\"></i>\n\t\t\t\t<div class=\"content\">\n\t\t\t\t\t<dynamic-component #dynamicContent [componentData]=\"data\"></dynamic-component>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t"
    }),
    __metadata("design:paramtypes", [ModalService, typeof (_c = typeof core_1.ComponentFactoryResolver !== "undefined" && core_1.ComponentFactoryResolver) === "function" && _c || Object])
], ModalComponent);
exports.ModalComponent = ModalComponent;
var _a, _b, _c;
//# sourceMappingURL=modal.js.map