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
var modal_1 = require("../modal/modal");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
require("rxjs/add/operator/toPromise");
var RecordListComponent = (function () {
    function RecordListComponent(http, cdr, 
        //private notifications: NotificationService,
        router, modalService) {
        this.http = http;
        this.cdr = cdr;
        this.router = router;
        this.modalService = modalService;
        this.viewables = [];
        this.sorting = {};
        this.loading = true;
        this.records = [];
        //Observables
        this.resultsSource = new Subject_1.Subject();
        this.results = this.resultsSource.asObservable();
        this.sortSource = new Subject_1.Subject();
        this.sort = this.sortSource.asObservable();
    }
    RecordListComponent.prototype.serialize = function (obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join('&');
    };
    RecordListComponent.prototype.ngOnInit = function () {
        var _this = this;
        var $this = this;
        this.config = this.config || {};
        this.config.defaultQuery = this.config.defaultQuery || '';
        if (this.config.openInModal) {
            this.modalService.modalStream.subscribe(function (modal) {
                if (modal.state == 'closed' && modal.data.instance instanceof _this.config.openInModal.component) {
                    _this.getResource(_this.resource);
                }
            });
        }
        //Always able to view and search by ID
        var idInSearchables = !!this.searchables.find(function (searchable) {
            return searchable.record == 'id';
        });
        if (!idInSearchables) {
            this.searchables.unshift({ label: 'ID', record: 'id', searchableOnly: 'true' });
        }
        //Filter out searchableOnly columns
        this.viewables = this.searchables.filter(function (viewable, index) {
            return !viewable.searchableOnly;
        });
        //Filter out viewableOnly columns
        this.searchables = this.searchables.filter(function (searchable, index) {
            return !searchable.viewableOnly;
        });
        //Set default value
        var name = this.searchables.find(function (value, index, array) { return value.label == 'Name'; });
        this.searchBy = name ? "filters[" + name.record + "]" : this.parseValue(this.searchables[1]);
        this.cdr.detectChanges();
    };
    RecordListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var $this = this;
        //Setup search subscription
        this.search.updates.subscribe(function (query) {
            var valid = typeof query == 'string' || typeof query == 'object' && Object.keys(query).length;
            switch (true) {
                case valid && typeof query == 'string':
                    _this.savedQuery = query;
                    break;
                case valid && typeof query == 'object':
                    query = _this.convertMapping(query);
                    _this.savedQuery = query;
                    break;
                case !valid:
                    query = '';
                    break;
            }
            _this.getResource(_this.resource, query);
        });
        //Setup sort subscription
        this.sort.subscribe(function (query) {
            _this.getResource(_this.resource, query);
        });
        //Get Records
        this.getResource(this.resource);
        this.cdr.detectChanges();
    };
    //API call
    RecordListComponent.prototype.getResource = function (path, data) {
        var _this = this;
        var $this = this;
        var headers = new http_1.Headers();
        var params;
        var options;
        headers.append('accept', 'application/json');
        data = data || {};
        //Handle both Objects and Strings for params
        if (typeof data == 'string') {
            params = data;
        }
        else if (typeof data == 'object') {
            params = this.serialize(data);
        }
        switch (true) {
            case !!params && !!this.config.defaultQuery:
                options = this.config.defaultQuery + "&" + params;
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
        this.searchables.map(function (searchable) {
            if (searchable.contains) {
                if (options.length && containsIndex == 0 || containsIndex > 0) {
                    options += '&';
                }
                options += "contains[" + containsIndex + "]=" + searchable.contains.model;
                containsIndex++;
            }
        });
        //Hide table rows
        this.loading = true;
        return this.http.get(path + '?' + options, { headers: headers })
            .toPromise()
            .then(function (response) {
            var results = response.json();
            //Send pagination data to search component
            results.pagination ? _this.resultsSource.next(results.pagination) : false;
            //Swap out compound values
            _this.records = _this.formatData(results.data);
            //Show table rows
            _this.loading = false;
        })
            .catch(function (error) {
            console.error(error);
        });
    };
    //Hide record if not in viewables
    RecordListComponent.prototype.show = function (record) {
        var show = this.viewables.find(function (element) {
            return element.record == record;
        });
        return !!show;
    };
    RecordListComponent.prototype.handleRecordClick = function (id) {
        if (this.config.openInModal) {
            var modal = this.config.openInModal.modal ? this.config.openInModal.modal : this.modal;
            var inputs = this.config.openInModal.inputs;
            inputs.id = id;
            modal.open({ component: this.config.openInModal.component, inputs: inputs });
        }
        else {
            var currentUrl = this.router.url;
            var route = this.config.route ? this.config.route + "/" + id : currentUrl + "/" + id;
            this.router.navigateByUrl(route);
        }
    };
    //Making Object.keys available in template
    RecordListComponent.prototype.keys = function (obj) {
        return Object.keys(obj);
    };
    RecordListComponent.prototype.parseValue = function (option) {
        var value;
        switch (true) {
            case !!option.contains:
                value = "matching[" + option.contains.model + "." + option.contains.replaceWith + "]";
                break;
            case !!option.map:
                value = "map[" + option.record + "]";
                break;
            default:
                value = "filters[" + option.record + "]";
                break;
        }
        return value;
    };
    //Handle table header click
    RecordListComponent.prototype.handleSort = function (viewable) {
        var $this = this;
        var savedQuery = this.savedQuery || false;
        var queryString = '';
        var query;
        var record;
        record = viewable.contains ? viewable.contains.model + "." + viewable.contains.replaceWith : viewable.record;
        //If already sorting on column clicked return current sorting otherwise clear sorting
        this.sorting = this.sorting[viewable.record] ? this.sorting : {};
        //Toggle ascending/descending
        this.sorting[record] = this.sorting[record] == 'ASC' ? 'DESC' : 'ASC';
        //Generate query string
        Object.keys(this.sorting)
            .map(function (record) {
            queryString += "order[" + record + "]=" + $this.sorting[record];
        });
        //If search has been done then sort the search results, otherwise send sort query by itself
        query = this.savedQuery ? this.savedQuery + ("&" + queryString) : queryString;
        this.sortSource.next(query);
    };
    RecordListComponent.prototype.formatData = function (rows) {
        var $this = this;
        var output;
        output = rows.map(function (record, index, array) {
            //Format any contains data
            $this.searchables.map(function (searchable) {
                if (record[searchable.record] && searchable.contains && record[searchable.contains.key]) {
                    record[searchable.record] = record[searchable.contains.key][searchable.contains.replaceWith];
                }
            });
            //Check for mediaType 
            $this.viewables.map(function (viewable) {
                if (record[viewable.record] && viewable.mediaType) {
                    record[viewable.record] = { mediaType: viewable.mediaType, src: record[viewable.record] };
                }
                if (viewable.parseAs) {
                    switch (viewable.parseAs) {
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
    };
    //Reorder fields that are not in viewables object;
    RecordListComponent.prototype.sortToViewable = function (record) {
        var $this = this;
        var obj = {};
        var fields = $this.viewables.map(function (element) {
            return element.record;
        });
        fields.forEach(function (element) {
            obj[element] = record[element];
        });
        Object.assign(obj, record);
        return obj;
    };
    //Return mapped values
    RecordListComponent.prototype.convertMapping = function (query) {
        var output;
        var map = this.searchBy.match(/(?!map\[)([a-zA-Z_]+)(?=\])/gi)[0];
        if (map) {
            output = '';
            //Get viewable
            var viewable = this.viewables.find(function (viewable) {
                return viewable.record == map;
            });
            //Get keys in viewable.map
            var keys = Object.keys(viewable.map);
            //Search keys for search input value and return the index
            var search = keys.filter(function (key, index, array) {
                var exp = new RegExp(query.value, 'gi');
                if (viewable.map[key].match(exp) && viewable.map[key].match(exp).length) {
                    return index;
                }
            });
            //Build the query
            search.map(function (value, index, array) {
                output += "filters[" + query.map + "][]=" + value;
                if (array.length > 1 && index < array.length - 1) {
                    output += '&';
                }
            });
        }
        else {
            //If search option is not 
            output = query;
        }
        return output;
    };
    return RecordListComponent;
}());
__decorate([
    core_1.ViewChild('search'),
    __metadata("design:type", Object)
], RecordListComponent.prototype, "search", void 0);
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", Object)
], RecordListComponent.prototype, "modal", void 0);
__decorate([
    core_1.Input('resource'),
    __metadata("design:type", Object)
], RecordListComponent.prototype, "resource", void 0);
__decorate([
    core_1.Input('searchables'),
    __metadata("design:type", Object)
], RecordListComponent.prototype, "searchables", void 0);
__decorate([
    core_1.Input('config'),
    __metadata("design:type", Object)
], RecordListComponent.prototype, "config", void 0);
RecordListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'record-list',
        template: "\n\t\t<search-pagination #search [filterOn]=\"searchBy\" [results]=\"results\">\n\t\t\t<select [(ngModel)]=\"searchBy\">\n\t\t\t\t<option *ngFor=\"let option of searchables\" [value]=\"parseValue(option)\">{{ option.label }}</option>\n\t\t\t</select>\n\t\t</search-pagination>\n\t\t<div class=\"spinner\" *ngIf=\"loading\">\n\t\t\t<md-spinner></md-spinner>\n\t\t</div>\n\t\t<div class=\"flex-table\">\n\t\t\t<div class=\"flex-row flex-table-header\">\n\t\t\t\t<div class=\"flex-column\" *ngFor=\"let viewable of viewables\" [ngClass]=\"viewable.record\" [attr.sort]=\"sorting[viewable.record]\" (click)=\"handleSort(viewable)\">\n\t\t\t\t\t{{ viewable.label }}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div *ngIf=\"!loading\">\n\t\t\t\t<div class=\"flex-row\" *ngFor=\"let record of records\" (click)=\"handleRecordClick(record.id)\">\n\t\t\t\t\t<div class=\"flex-column\" *ngFor=\"let item of keys(record)\" [ngClass]=\"item\" [attr.show]=\"show(item)\">\n\t\t\t\t\t\t<img *ngIf=\"record[item] && record[item].mediaType == 'image'\" [src]=\"record[item].src\">\n\t\t\t\t\t\t<span [innerHTML]=\"( record[item] && record[item].mediaType ? '' : record[item] )\"></span>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t\t<modal #modal></modal>\n\t",
        styleUrls: ['record-list.component.css']
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.Http !== "undefined" && http_1.Http) === "function" && _a || Object, typeof (_b = typeof core_1.ChangeDetectorRef !== "undefined" && core_1.ChangeDetectorRef) === "function" && _b || Object, typeof (_c = typeof router_1.Router !== "undefined" && router_1.Router) === "function" && _c || Object, typeof (_d = typeof modal_1.ModalService !== "undefined" && modal_1.ModalService) === "function" && _d || Object])
], RecordListComponent);
exports.RecordListComponent = RecordListComponent;
var _a, _b, _c, _d;
//# sourceMappingURL=record-list.component.js.map