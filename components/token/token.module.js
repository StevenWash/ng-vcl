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
var common_1 = require("@angular/common");
var metalist_module_1 = require("../metalist/metalist.module");
var l10n_module_1 = require("../../l10n/l10n.module");
var forms_1 = require("@angular/forms");
var token_component_1 = require("./token.component");
var token_list_component_1 = require("./token-list.component");
var token_input_component_1 = require("./token-input.component");
var VCLTokenModule = (function () {
    function VCLTokenModule() {
    }
    return VCLTokenModule;
}());
VCLTokenModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, l10n_module_1.L10nModule, metalist_module_1.VCLMetalistModule, forms_1.FormsModule],
        exports: [token_component_1.TokenComponent, token_list_component_1.TokenListComponent, token_input_component_1.TokenInputComponent],
        declarations: [token_component_1.TokenComponent, token_list_component_1.TokenListComponent, token_input_component_1.TokenInputComponent],
        providers: [],
    }),
    __metadata("design:paramtypes", [])
], VCLTokenModule);
exports.VCLTokenModule = VCLTokenModule;
