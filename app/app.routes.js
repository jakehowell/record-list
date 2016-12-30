"use strict";
var index_1 = require("./components/index");
var home_component_1 = require("./home/home.component");
exports.ROUTES = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'edit/:id', component: index_1.EditComponent }
];
//# sourceMappingURL=app.routes.js.map