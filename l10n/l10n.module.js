"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var l10n_loader_service_1 = require("./l10n-loader.service");
var l10n_parser_service_1 = require("./l10n-parser.service");
var l10n_service_1 = require("./l10n.service");
var l10n_pipe_1 = require("./l10n.pipe");
var l10n_loader_service_2 = require("./l10n-loader.service");
exports.L10nNoopLoaderService = l10n_loader_service_2.L10nNoopLoaderService;
exports.L10nStaticLoaderService = l10n_loader_service_2.L10nStaticLoaderService;
var l10n_parser_service_2 = require("./l10n-parser.service");
exports.L10nFormatParserService = l10n_parser_service_2.L10nFormatParserService;
var l10n_service_2 = require("./l10n.service");
exports.L10nService = l10n_service_2.L10nService;
var L10nModule = L10nModule_1 = (function () {
    function L10nModule() {
    }
    L10nModule.forRoot = function (config) {
        return {
            ngModule: L10nModule_1,
            providers: [
                l10n_service_1.L10nService,
                {
                    provide: l10n_service_1.L10N_CONFIG,
                    useValue: config.config || {}
                },
                {
                    provide: l10n_loader_service_1.L10nLoaderService,
                    useClass: config.loader
                }, {
                    provide: l10n_loader_service_1.L10N_LOADER_CONFIG,
                    useValue: config.loaderConfig || {}
                }, {
                    provide: l10n_parser_service_1.L10nParserService,
                    useClass: config.parser || l10n_parser_service_1.L10nFormatParserService
                }
            ]
        };
    };
    return L10nModule;
}());
L10nModule = L10nModule_1 = __decorate([
    core_1.NgModule({
        imports: [],
        declarations: [
            l10n_pipe_1.L10nPipe
        ],
        exports: [
            l10n_pipe_1.L10nPipe
        ],
        providers: [
            // TODO: Remove provider. Should work when marked optional in pipe
            // not sure why it isn't
            {
                provide: l10n_service_1.L10N_CONFIG,
                useValue: {}
            },
            l10n_service_1.L10nService,
            {
                provide: l10n_loader_service_1.L10nLoaderService,
                useClass: l10n_loader_service_1.L10nNoopLoaderService
            },
            {
                provide: l10n_loader_service_1.L10N_LOADER_CONFIG,
                useValue: {}
            },
            {
                provide: l10n_parser_service_1.L10nParserService,
                useClass: l10n_parser_service_1.L10nFormatParserService
            }
        ]
    })
], L10nModule);
exports.L10nModule = L10nModule;
var L10nModule_1;
