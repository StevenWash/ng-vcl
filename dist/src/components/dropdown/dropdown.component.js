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
var forms_1 = require("@angular/forms");
exports.CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return DropdownComponent; }),
    multi: true
};
var DropdownComponent = (function () {
    function DropdownComponent() {
        var _this = this;
        this.select = new core_1.EventEmitter();
        this.tabindex = 0;
        this.expanded = false;
        this.expandedChange = new core_1.EventEmitter();
        this.maxSelectableItems = 1;
        this.minSelectableItems = 1;
        this.ariaRole = 'listbox';
        this.metaInformation = [];
        this.select.subscribe(function (selectedItems) {
            _this.selected = selectedItems;
            !!_this.onChangeCallback && _this.onChangeCallback(selectedItems);
        });
    }
    DropdownComponent.prototype._selectItem = function (item, meta, metalist) {
        if (this.maxSelectableItems === 1) {
            this.expanded = false;
            this.expandedChange.emit(this.expanded);
            metalist.selectItem(item);
        }
        else {
            if (meta.selected) {
                metalist.deSelectItem(item);
            }
            else {
                metalist.selectItem(item);
            }
        }
    };
    DropdownComponent.prototype.selectItem = function (item) {
        this.metalist.selectItem(item);
    };
    DropdownComponent.prototype.onSelect = function (selectedItems) {
        this.select.emit(selectedItems);
    };
    DropdownComponent.prototype.writeValue = function (value) {
        if (value !== this.selected) {
            this.selected = value;
        }
    };
    DropdownComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    DropdownComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    return DropdownComponent;
}());
__decorate([
    core_1.ViewChild('metalist'),
    __metadata("design:type", Object)
], DropdownComponent.prototype, "metalist", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DropdownComponent.prototype, "select", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], DropdownComponent.prototype, "items", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], DropdownComponent.prototype, "tabindex", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DropdownComponent.prototype, "expanded", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], DropdownComponent.prototype, "expandedChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], DropdownComponent.prototype, "maxSelectableItems", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], DropdownComponent.prototype, "minSelectableItems", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DropdownComponent.prototype, "ariaRole", void 0);
DropdownComponent = __decorate([
    core_1.Component({
        selector: 'vcl-dropdown',
        templateUrl: 'dropdown.component.html',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        providers: [exports.CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
    }),
    __metadata("design:paramtypes", [])
], DropdownComponent);
exports.DropdownComponent = DropdownComponent;
