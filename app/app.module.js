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
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var router_1 = require("@angular/router");
var modal_1 = require("./modal/modal");
var app_component_1 = require("./app.component");
var index_1 = require("./components/index");
var home_component_1 = require("./home/home.component");
var record_list_component_1 = require("./record-list/record-list.component");
var search_pagination_component_1 = require("./search-pagination/search-pagination.component");
var app_routes_1 = require("./app.routes");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            forms_1.FormsModule,
            //InMemoryWebApiModule.forRoot(ApiMockDataService),
            router_1.RouterModule.forRoot(app_routes_1.ROUTES),
            material_1.MaterialModule.forRoot()
        ],
        declarations: [
            app_component_1.AppComponent,
            home_component_1.HomeComponent,
            modal_1.ModalComponent,
            modal_1.DynamicComponent,
            index_1.EditComponent,
            record_list_component_1.RecordListComponent,
            search_pagination_component_1.SearchPaginationComponent
        ],
        providers: [
            platform_browser_1.Title,
            modal_1.ModalService
        ],
        bootstrap: [app_component_1.AppComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map