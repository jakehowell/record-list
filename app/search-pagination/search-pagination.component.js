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
var Subject_1 = require("rxjs/Subject");
var Observable_1 = require("rxjs/Observable");
var SearchPaginationComponent = (function () {
    function SearchPaginationComponent() {
        this.updateResults = new core_1.EventEmitter(true);
        this.currentPage = 1;
        this.loading = false;
        this.updatesSource = new Subject_1.Subject();
        this.updates = this.updatesSource.asObservable();
        this.pages = [];
        this.pagination = {
            page_count: 0,
            current_page: 1
        };
    }
    SearchPaginationComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.results.subscribe(function (pages) {
            _this.pagination = pages;
            for (var i = 0; i < _this.pagination.page_count; i++) {
                _this.pages[i] = { number: i + 1 };
            }
        });
    };
    SearchPaginationComponent.prototype.sendQuery = function (query) {
        this.updatesSource.next(query);
    };
    //Handle typing in search field
    SearchPaginationComponent.prototype.handleInput = function (event) {
        var _this = this;
        clearTimeout(this.timeout);
        this.timeout = null;
        this.timeout = setTimeout(function () {
            var query, filterString;
            var value = event.target.value;
            if (!value || value == '') {
                value = false;
            }
            if (_this.filterOn.match(/filters/gi) && _this.filterOn.match(/filters/gi).length) {
                filterString = _this.filterOn + "[op]=llike&" + _this.filterOn + "[value]=" + value;
            }
            if (_this.filterOn.match(/matching/gi) && _this.filterOn.match(/matching/gi).length) {
                filterString = _this.filterOn + "=" + value;
            }
            if (_this.filterOn.match(/map/gi) && _this.filterOn.match(/map/gi).length) {
                filterString = { map: _this.filterOn.match(/(?!map\[)([a-zA-Z_]+)(?=\])/gi)[0], value: value };
            }
            query = value ? filterString : {};
            _this.sendQuery(query);
            _this.updateResults.emit(query);
        }, 500);
    };
    //Handle click on specific page number
    SearchPaginationComponent.prototype.handleGoToPage = function (page) {
        var query = "page=" + page;
        this.sendQuery(query);
    };
    //Handle click on prev page button
    SearchPaginationComponent.prototype.handlePrevPage = function () {
        var query = "page=" + (this.pagination.current_page - 1);
        this.sendQuery(query);
    };
    //Handle click on next page button
    SearchPaginationComponent.prototype.handleNextPage = function () {
        var query = "page=" + (this.pagination.current_page + 1);
        this.sendQuery(query);
    };
    return SearchPaginationComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], SearchPaginationComponent.prototype, "filterOn", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_a = typeof Observable_1.Observable !== "undefined" && Observable_1.Observable) === "function" && _a || Object)
], SearchPaginationComponent.prototype, "results", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], SearchPaginationComponent.prototype, "updateResults", void 0);
SearchPaginationComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'search-pagination',
        templateUrl: 'search-pagination.component.html',
        styleUrls: ['search-pagination.component.css'],
        encapsulation: core_1.ViewEncapsulation.None
    }),
    __metadata("design:paramtypes", [])
], SearchPaginationComponent);
exports.SearchPaginationComponent = SearchPaginationComponent;
var _a;
//# sourceMappingURL=search-pagination.component.js.map