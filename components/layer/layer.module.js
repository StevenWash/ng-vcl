"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var layer_component_1 = require('./layer.component');
exports.LayerBaseComponent = layer_component_1.LayerBaseComponent;
exports.LayerDirective = layer_component_1.LayerDirective;
var layer_service_1 = require('./layer.service');
exports.LayerService = layer_service_1.LayerService;
var off_click_module_1 = require('../../directives/off-click/off-click.module');
var wormhole_module_1 = require('../../directives/wormhole/wormhole.module');
var VCLLayerModule = (function () {
    function VCLLayerModule() {
    }
    VCLLayerModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule, wormhole_module_1.VCLWormholeModule, off_click_module_1.VCLOffClickModule],
                    exports: [layer_component_1.LayerBaseComponent, layer_component_1.LayerDirective],
                    declarations: [layer_component_1.LayerBaseComponent, layer_component_1.LayerDirective],
                    providers: [layer_service_1.LayerService]
                },] },
    ];
    /** @nocollapse */
    VCLLayerModule.ctorParameters = [];
    return VCLLayerModule;
}());
exports.VCLLayerModule = VCLLayerModule;
