"use strict";
// TODO: This class is just a copy of the checkbox with slight modifications
// Use inheritance once supported
// https://github.com/angular/angular/issues/11606
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
exports.CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return RadioGroupComponent; }),
    multi: true
};
var RadioGroupComponent = (function () {
    function RadioGroupComponent() {
    }
    RadioGroupComponent.prototype.ngOnInit = function () { };
    RadioGroupComponent.prototype.ngOnChanges = function () { };
    RadioGroupComponent.prototype.isChecked = function (option) {
        return option.value == this.value;
    };
    RadioGroupComponent.prototype.buttonChanged = function (value, state) {
        if (this.value == value)
            return;
        this.value = value;
        !!this.onChangeCallback && this.onChangeCallback(this.value);
    };
    RadioGroupComponent.prototype.writeValue = function (value) {
        this.value = value;
    };
    RadioGroupComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    RadioGroupComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    RadioGroupComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'vcl-radio-group',
                    templateUrl: 'radio-group.component.html',
                    host: {},
                    //changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [exports.CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    RadioGroupComponent.ctorParameters = [];
    RadioGroupComponent.propDecorators = {
        'value': [{ type: core_1.Input, args: ['value',] },],
        'options': [{ type: core_1.Input, args: ['options',] },],
    };
    return RadioGroupComponent;
}());
exports.RadioGroupComponent = RadioGroupComponent;
