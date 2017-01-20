"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var jss_form_component_1 = require("./jss-form.component");
var l10n_module_1 = require("../../l10n/l10n.module");
var forms_1 = require("@angular/forms");
var dropdown_module_1 = require("../dropdown/dropdown.module");
var flip_switch_module_1 = require("../flip-switch/flip-switch.module");
var slider_module_1 = require("../slider/slider.module");
var checkbox_module_1 = require("../checkbox/checkbox.module");
var select_module_1 = require("../select/select.module");
var radio_group_module_1 = require("../radio-group/radio-group.module");
var input_control_group_module_1 = require("../input-control-group/input-control-group.module");
var VCLJssFormModule = (function () {
    function VCLJssFormModule() {
    }
    return VCLJssFormModule;
}());
VCLJssFormModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule, l10n_module_1.L10nModule, forms_1.FormsModule, forms_1.ReactiveFormsModule,
            dropdown_module_1.VCLDropdownModule,
            flip_switch_module_1.VCLFlipSwitchModule,
            slider_module_1.VCLSliderModule,
            checkbox_module_1.VCLCheckboxModule,
            select_module_1.VCLSelectModule,
            radio_group_module_1.VCLRadioGroupModule,
            input_control_group_module_1.VCLInputControlGroupModule
        ],
        exports: [jss_form_component_1.JssFormComponent, jss_form_component_1.JssFormObjectComponent],
        declarations: [jss_form_component_1.JssFormComponent, jss_form_component_1.JssFormObjectComponent],
        providers: [],
    })
], VCLJssFormModule);
exports.VCLJssFormModule = VCLJssFormModule;
