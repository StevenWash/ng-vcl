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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var core_1 = require("@angular/core");
require("hammerjs");
var input_module_1 = require("./components/input/input.module");
var textarea_module_1 = require("./components/textarea/textarea.module");
var flip_switch_module_1 = require("./components/flip-switch/flip-switch.module");
var icon_module_1 = require("./components/icon/icon.module");
var metalist_module_1 = require("./components/metalist/metalist.module");
var dropdown_module_1 = require("./components/dropdown/dropdown.module");
var select_module_1 = require("./components/select/select.module");
var icogram_module_1 = require("./components/icogram/icogram.module");
var button_module_1 = require("./components/button/button.module");
var button_group_module_1 = require("./components/button-group/button-group.module");
var layer_module_1 = require("./components/layer/layer.module");
var tab_nav_module_1 = require("./components/tab-nav/tab-nav.module");
var navigation_module_1 = require("./components/navigation/navigation.module");
var toolbar_module_1 = require("./components/toolbar/toolbar.module");
var tether_module_1 = require("./components/tether/tether.module");
var link_module_1 = require("./components/link/link.module");
var popover_module_1 = require("./components/popover/popover.module");
var progress_bar_module_1 = require("./components/progress-bar/progress-bar.module");
var radio_button_module_1 = require("./components/radio-button/radio-button.module");
var radio_group_module_1 = require("./components/radio-group/radio-group.module");
var checkbox_module_1 = require("./components/checkbox/checkbox.module");
var off_click_module_1 = require("./directives/off-click/off-click.module");
var form_control_label_module_1 = require("./components/form-control-label/form-control-label.module");
var form_module_1 = require("./components/form/form.module");
var json_editor_module_1 = require("./components/json-editor/json-editor.module");
var wormhole_module_1 = require("./directives/wormhole/wormhole.module");
var month_picker_module_1 = require("./components/month-picker/month-picker.module");
var date_picker_module_1 = require("./components/date-picker/date-picker.module");
var label_module_1 = require("./components/label/label.module");
var token_module_1 = require("./components/token/token.module");
var slider_module_1 = require("./components/slider/slider.module");
var jss_form_module_1 = require("./components/jss-form/jss-form.module");
var input_control_group_module_1 = require("./components/input-control-group/input-control-group.module");
__export(require("./core/index"));
__export(require("./components/input/input.module"));
__export(require("./components/textarea/textarea.module"));
__export(require("./components/icon/icon.module"));
__export(require("./components/icogram/icogram.module"));
__export(require("./components/button/button.module"));
__export(require("./components/button-group/button-group.module"));
__export(require("./components/layer/layer.module"));
__export(require("./components/tab-nav/tab-nav.module"));
__export(require("./components/navigation/navigation.module"));
__export(require("./components/form/form.module"));
__export(require("./components/toolbar/toolbar.module"));
__export(require("./components/tether/tether.module"));
__export(require("./components/link/link.module"));
__export(require("./components/popover/popover.module"));
__export(require("./components/progress-bar/progress-bar.module"));
__export(require("./components/radio-button/radio-button.module"));
__export(require("./components/radio-group/radio-group.module"));
__export(require("./components/checkbox/checkbox.module"));
__export(require("./components/month-picker/month-picker.module"));
__export(require("./components/date-picker/date-picker.module"));
__export(require("./components/json-editor/json-editor.module"));
__export(require("./components/label/label.module"));
__export(require("./components/token/token.module"));
__export(require("./components/slider/slider.module"));
__export(require("./components/jss-form/jss-form.module"));
__export(require("./components/input-control-group/input-control-group.module"));
__export(require("./directives/off-click/off-click.module"));
__export(require("./directives/wormhole/wormhole.module"));
__export(require("./l10n/l10n.module"));
__export(require("./adv-http/index"));
__export(require("./store/index"));
var VCLModule = (function () {
    function VCLModule() {
    }
    return VCLModule;
}());
VCLModule = __decorate([
    core_1.NgModule({
        imports: [
            wormhole_module_1.VCLWormholeModule,
            icon_module_1.VCLIconModule,
            icogram_module_1.VCLIcogramModule,
            button_module_1.VCLButtonModule,
            button_group_module_1.VCLButtonGroupModule,
            layer_module_1.VCLLayerModule,
            tether_module_1.VCLTetherModule,
            link_module_1.VCLLinkModule,
            input_module_1.VCLInputModule,
            textarea_module_1.VCLTextareaModule,
            flip_switch_module_1.VCLFlipSwitchModule,
            tab_nav_module_1.VCLTabNavModule,
            navigation_module_1.VCLNavigationModule,
            toolbar_module_1.VCLToolbarModule,
            popover_module_1.VCLPopoverModule,
            progress_bar_module_1.VCLProgressBarModule,
            radio_button_module_1.VCLRadioButtonModule,
            radio_group_module_1.VCLRadioGroupModule,
            checkbox_module_1.VCLCheckboxModule,
            form_control_label_module_1.VCLFormControlLabelModule,
            form_module_1.VCLFormModule,
            metalist_module_1.VCLMetalistModule,
            dropdown_module_1.VCLDropdownModule,
            select_module_1.VCLSelectModule,
            off_click_module_1.VCLOffClickModule,
            month_picker_module_1.VCLMonthPickerModule,
            date_picker_module_1.VCLDatePickerModule,
            json_editor_module_1.VCLJsonEditorModule,
            label_module_1.VCLLabelModule,
            token_module_1.VCLTokenModule,
            slider_module_1.VCLSliderModule,
            jss_form_module_1.VCLJssFormModule,
            input_control_group_module_1.VCLInputControlGroupModule
        ],
        exports: [
            wormhole_module_1.VCLWormholeModule,
            icon_module_1.VCLIconModule,
            icogram_module_1.VCLIcogramModule,
            button_module_1.VCLButtonModule,
            button_group_module_1.VCLButtonGroupModule,
            layer_module_1.VCLLayerModule,
            tether_module_1.VCLTetherModule,
            link_module_1.VCLLinkModule,
            input_module_1.VCLInputModule,
            textarea_module_1.VCLTextareaModule,
            flip_switch_module_1.VCLFlipSwitchModule,
            tab_nav_module_1.VCLTabNavModule,
            navigation_module_1.VCLNavigationModule,
            toolbar_module_1.VCLToolbarModule,
            popover_module_1.VCLPopoverModule,
            progress_bar_module_1.VCLProgressBarModule,
            radio_button_module_1.VCLRadioButtonModule,
            radio_group_module_1.VCLRadioGroupModule,
            checkbox_module_1.VCLCheckboxModule,
            form_control_label_module_1.VCLFormControlLabelModule,
            form_module_1.VCLFormModule,
            metalist_module_1.VCLMetalistModule,
            dropdown_module_1.VCLDropdownModule,
            select_module_1.VCLSelectModule,
            off_click_module_1.VCLOffClickModule,
            month_picker_module_1.VCLMonthPickerModule,
            date_picker_module_1.VCLDatePickerModule,
            json_editor_module_1.VCLJsonEditorModule,
            label_module_1.VCLLabelModule,
            token_module_1.VCLTokenModule,
            slider_module_1.VCLSliderModule,
            jss_form_module_1.VCLJssFormModule,
            input_control_group_module_1.VCLInputControlGroupModule
        ],
        providers: [],
    }),
    __metadata("design:paramtypes", [])
], VCLModule);
exports.VCLModule = VCLModule;
