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
var Observable_1 = require("rxjs/Observable");
var core_1 = require("@angular/core");
var Tether = require("tether");
var tetherID = 10000;
var TetherComponent = (function () {
    function TetherComponent(myElement) {
        this.myElement = myElement;
        this._error = new core_1.EventEmitter();
        this.id = 'vcl-tetherId' + tetherID++;
    }
    Object.defineProperty(TetherComponent.prototype, "error", {
        get: function () {
            return this._error.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    TetherComponent.prototype.ngAfterViewInit = function () {
        try {
            this.tether = new Tether({
                element: '#' + this.id,
                target: this.target,
                attachment: this.attachment,
                targetAttachment: this.targetAttachment
            });
        }
        catch (ex) {
            this._error.emit(ex);
        }
    };
    TetherComponent.prototype.ngOnDestroy = function () {
        try {
            if (this.tether) {
                this.tether.destroy();
                // Workaround for a special case when using position:relative 
                // The target elements are removed from the DOM before tether.js is able to clean the tethered elements.
                // This workaround removes them manually 
                var tether = this.tether;
                var el = tether.element;
                var target = tether.target;
                if (el && target && el.parentNode && target.offsetParent === null) {
                    el.parentNode.removeChild(el);
                }
            }
        }
        catch (ex) { }
    };
    return TetherComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TetherComponent.prototype, "target", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TetherComponent.prototype, "class", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], TetherComponent.prototype, "zIndex", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TetherComponent.prototype, "targetAttachment", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TetherComponent.prototype, "attachment", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Observable_1.Observable),
    __metadata("design:paramtypes", [])
], TetherComponent.prototype, "error", null);
TetherComponent = __decorate([
    core_1.Component({
        selector: 'vcl-tether',
        templateUrl: 'tether.component.html'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], TetherComponent);
exports.TetherComponent = TetherComponent;
