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
var Observable_1 = require("rxjs/Observable");
var forms_1 = require("@angular/forms");
exports.CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return CheckboxComponent; }),
    multi: true
};
var CheckboxComponent = (function () {
    function CheckboxComponent(elementRef) {
        var _this = this;
        this.elementRef = elementRef;
        this.tabindex = 0;
        this.checkedIcon = 'fa:check-square-o';
        this.uncheckedIcon = 'fa:square-o';
        this.disabled = false;
        this.labelPosition = 'right';
        /**
        Reflects the checked state, `true` is checked and `false` is unchecked
        @public
        */
        this.checked = false;
        /**
        Action fired when the `checked` state changes due to user interaction.
        */
        this._checkedChange = new core_1.EventEmitter();
        this._checkedChange.subscribe(function (newVal) {
            !!_this.onChangeCallback && _this.onChangeCallback(newVal);
        });
    }
    Object.defineProperty(CheckboxComponent.prototype, "checkedChange", {
        get: function () {
            return this._checkedChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    CheckboxComponent.prototype.ngOnInit = function () { };
    CheckboxComponent.prototype.ngOnChanges = function (changes) {
        if (changes['checked']) {
            var checked = changes['checked'].currentValue;
            // this._checkedChange.emit(checked);
            this.focusMaintenance(checked);
        }
    };
    Object.defineProperty(CheckboxComponent.prototype, "clsVclDisabled", {
        get: function () {
            return !!this.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxComponent.prototype, "attrAriaDisabled", {
        get: function () {
            return !!this.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxComponent.prototype, "attrChecked", {
        get: function () {
            return !!this.checked;
        },
        enumerable: true,
        configurable: true
    });
    CheckboxComponent.prototype.onKeyup = function (ev) {
        switch (ev.code) {
            case 'Space':
                this.triggerChangeAction(ev);
                break;
        }
    };
    CheckboxComponent.prototype.onClick = function (e) {
        return this.triggerChangeAction(e);
    };
    CheckboxComponent.prototype.triggerChangeAction = function (e) {
        e.preventDefault();
        if (this.disabled)
            return;
        this.checked = !this.checked;
        this._checkedChange.emit(this.checked);
    };
    CheckboxComponent.prototype.focusMaintenance = function (checked) {
        if (this.checked === true && this.elementRef.nativeElement) {
            this.elementRef.nativeElement.focus();
        }
    };
    Object.defineProperty(CheckboxComponent.prototype, "icon", {
        get: function () {
            return this.checked ? this.checkedIcon : this.uncheckedIcon;
        },
        enumerable: true,
        configurable: true
    });
    CheckboxComponent.prototype.writeValue = function (value) {
        if (value !== this.checked) {
            this.checked = value;
        }
    };
    CheckboxComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    CheckboxComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    return CheckboxComponent;
}());
__decorate([
    core_1.HostBinding(),
    __metadata("design:type", Object)
], CheckboxComponent.prototype, "tabindex", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CheckboxComponent.prototype, "checkedIcon", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CheckboxComponent.prototype, "uncheckedIcon", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], CheckboxComponent.prototype, "disabled", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CheckboxComponent.prototype, "labelPosition", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], CheckboxComponent.prototype, "checked", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Observable_1.Observable),
    __metadata("design:paramtypes", [])
], CheckboxComponent.prototype, "checkedChange", null);
__decorate([
    core_1.HostBinding('class.vclDisabled'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], CheckboxComponent.prototype, "clsVclDisabled", null);
__decorate([
    core_1.HostBinding('attr.aria-disabled'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], CheckboxComponent.prototype, "attrAriaDisabled", null);
__decorate([
    core_1.HostBinding('attr.checked'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], CheckboxComponent.prototype, "attrChecked", null);
__decorate([
    core_1.HostListener('keydown', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CheckboxComponent.prototype, "onKeyup", null);
__decorate([
    core_1.HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CheckboxComponent.prototype, "onClick", null);
CheckboxComponent = __decorate([
    core_1.Component({
        selector: 'vcl-checkbox',
        templateUrl: 'checkbox.component.html',
        host: {
            '[attr.role]': '"checkbox"',
            '[class.vclCheckbox]': 'true',
            '[class.vclScale130p]': 'true',
        },
        providers: [exports.CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], CheckboxComponent);
exports.CheckboxComponent = CheckboxComponent;
