webpackJsonp([17],{484:function(l,n,e){"use strict";var t=this&&this.__extends||function(){var l=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(l,n){l.__proto__=n}||function(l,n){for(var e in n)n.hasOwnProperty(e)&&(l[e]=n[e])};return function(n,e){function t(){this.constructor=n}l(n,e),n.prototype=null===e?Object.create(e):(t.prototype=e.prototype,new t)}}();Object.defineProperty(n,"__esModule",{value:!0});var o=e(1),a=e(884),s=e(21),u=e(19),r=e(76),i=e(48),c=e(218),d=e(516),p=e(118),b=e(243),m=e(119),h=e(120),f=e(32),v=e(41),C=e(515),g=e(837),_=e(511),L=function(l){function n(n){return l.call(this,n,[C.DemoComponentNgFactory,g.FormControlLabelDemoComponentNgFactory],[])||this}return t(n,l),Object.defineProperty(n.prototype,"_NgLocalization_13",{get:function(){return null==this.__NgLocalization_13&&(this.__NgLocalization_13=new s.NgLocaleLocalization(this.parent.get(o.LOCALE_ID))),this.__NgLocalization_13},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"_ɵi_14",{get:function(){return null==this.__ɵi_14&&(this.__ɵi_14=new u.ɵi),this.__ɵi_14},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"_IconService_15",{get:function(){return null==this.__IconService_15&&(this.__IconService_15=new v.IconService),this.__IconService_15},enumerable:!0,configurable:!0}),n.prototype.createInternal=function(){return this._CommonModule_0=new s.CommonModule,this._ɵba_1=new u.ɵba,this._FormsModule_2=new u.FormsModule,this._L10nModule_3=new r.L10nModule,this._VCLWormholeModule_4=new i.VCLWormholeModule,this._VCLTabNavModule_5=new c.VCLTabNavModule,this._DemoModule_6=new d.DemoModule,this._VCLIconModule_7=new p.VCLIconModule,this._VCLFormControlLabelModule_8=new b.VCLFormControlLabelModule,this._VCLIcogramModule_9=new m.VCLIcogramModule,this._VCLButtonModule_10=new h.VCLButtonModule,this._RouterModule_11=new f.RouterModule(this.parent.get(f.ɵa,null),this.parent.get(f.Router,null)),this._FormControlLabelDemoModule_12=new a.FormControlLabelDemoModule,this._ROUTES_16=[[{path:"",component:_.DemoComponent,data:{demo:a.demo}}]],this._FormControlLabelDemoModule_12},n.prototype.getInternal=function(l,n){return l===s.CommonModule?this._CommonModule_0:l===u.ɵba?this._ɵba_1:l===u.FormsModule?this._FormsModule_2:l===r.L10nModule?this._L10nModule_3:l===i.VCLWormholeModule?this._VCLWormholeModule_4:l===c.VCLTabNavModule?this._VCLTabNavModule_5:l===d.DemoModule?this._DemoModule_6:l===p.VCLIconModule?this._VCLIconModule_7:l===b.VCLFormControlLabelModule?this._VCLFormControlLabelModule_8:l===m.VCLIcogramModule?this._VCLIcogramModule_9:l===h.VCLButtonModule?this._VCLButtonModule_10:l===f.RouterModule?this._RouterModule_11:l===a.FormControlLabelDemoModule?this._FormControlLabelDemoModule_12:l===s.NgLocalization?this._NgLocalization_13:l===u.ɵi?this._ɵi_14:l===v.IconService?this._IconService_15:l===f.ROUTES?this._ROUTES_16:n},n.prototype.destroyInternal=function(){},n}(o.ɵNgModuleInjector);n.FormControlLabelDemoModuleNgFactory=new o.NgModuleFactory(L,a.FormControlLabelDemoModule)},510:function(l,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=function(){function l(){}return l}();n.TabLabelDirective=t;var o=function(){function l(){this.disabled=!1,this.tabClass=""}return l}();n.TabComponent=o},511:function(l,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=e(32),o=e(22),a=function(){function l(l,n){this.activatedRoute=l,this.sanitizer=n,this.tabs=[]}return l.prototype.ngOnInit=function(){var l=this,n=this.activatedRoute.snapshot.data.demo();n?(this.title=n.label,n.tabs?this.tabs=Object.keys(n.tabs).map(function(e){var t,o;return"object"==typeof n.tabs[e]&&n.tabs[e]?(t=n.tabs[e].type,o="pre"===t||"html"===t||"md"===t?l.sanitizer.bypassSecurityTrustHtml(n.tabs[e].content):n.tabs[e].content):"function"==typeof n.tabs[e]&&(t="component",o=n.tabs[e]),{name:e,content:o,type:t}}):this.tabs=[]):(this.title="ng-vcl",this.tabs=[])},l.ctorParameters=function(){return[{type:t.ActivatedRoute},{type:o.DomSanitizer}]},l}();n.DemoComponent=a},512:function(l,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=e(48),o=e(1),a=e(510),s=function(){function l(){this.layout="",this.tabbableClass="",this.tabsClass="",this.tabContentClass="",this.borders=!1,this.selectedTabIndex=0,this.selectedTabIndexChange$=new o.EventEmitter}return Object.defineProperty(l.prototype,"tabContent",{set:function(l){this.wormholeHost=new t.WormholeHost(l)},enumerable:!0,configurable:!0}),Object.defineProperty(l.prototype,"selectedTabIndexChange",{get:function(){return this.selectedTabIndexChange$.asObservable()},enumerable:!0,configurable:!0}),l.prototype.selectTab=function(l){var n,e,t=this.tabs.toArray();l instanceof a.TabComponent?(n=t.indexOf(l),e=l):"number"==typeof l&&t[l]?(n=l,e=t[n]):(n=-1,e=null),n>=0&&e instanceof a.TabComponent&&!e.disabled&&(this.wormholeHost.clearWormholes(),this.selectedTabIndex=n,this.selectedTabIndexChange$.emit(n),this.wormholeHost.connectWormhole(e.content))},l.prototype.ngAfterContentInit=function(){this.selectTab(this.selectedTabIndex)},l.prototype.ngOnDestroy=function(){this.wormholeHost.clearWormholes()},l}();n.TabNavComponent=s},513:function(l,n,e){"use strict";function t(l){return s.ɵvid(0,[(l()(),s.ɵeld(0,null,null,7,"div",[["role","tab"]],[[8,"className",0],[2,"vclDisabled",null],[2,"vclSelected",null],[2,"aria-selected",null]],[[null,"tap"]],function(l,n,e){var t=!0,o=l.component;if("tap"===n){t=!1!==o.selectTab(l.context.$implicit)&&t}return t},null,null)),(l()(),s.ɵted(null,["\n        "])),(l()(),s.ɵeld(0,null,null,4,"span",[["class","vclTabLabel"]],null,null,null,null,null)),(l()(),s.ɵted(null,[" \n          "])),(l()(),s.ɵeld(16777216,null,null,1,"wormhole",[],null,null,null,null,null)),s.ɵdid(671744,null,0,u.WormholeDirective,[s.ViewContainerRef],{target:[0,"target"]},null),(l()(),s.ɵted(null,["\n        "])),(l()(),s.ɵted(null,["\n    "]))],function(l,n){l(n,5,0,n.context.$implicit.label)},function(l,n){var e=n.component;l(n,0,0,s.ɵinlineInterpolate(1,"vclTab ",n.context.$implicit.tabClass,""),n.context.$implicit.disabled,e.selectedTabIndex===n.context.index,e.selectedTabIndex===n.context.index)})}function o(l){return s.ɵvid(0,[s.ɵqud(402653184,1,{tabContent:0}),(l()(),s.ɵeld(0,null,null,20,"div",[],[[8,"className",0],[2,"vclTabsLeft",null],[2,"vclTabsRight",null]],null,null,null,null)),(l()(),s.ɵted(null,["\n  "])),(l()(),s.ɵeld(0,null,null,4,"div",[["role","tablist"]],[[8,"className",0],[2,"vclTabStyleUni",null]],null,null,null,null)),(l()(),s.ɵted(null,["\n    "])),(l()(),s.ɵand(16777216,null,null,1,null,t)),s.ɵdid(802816,null,0,r.NgForOf,[s.ViewContainerRef,s.TemplateRef,s.IterableDiffers],{ngForOf:[0,"ngForOf"]},null),(l()(),s.ɵted(null,["\n  "])),(l()(),s.ɵted(null,["\n  "])),(l()(),s.ɵeld(0,null,null,11,"div",[],[[8,"className",0],[2,"vclNoBorder",null]],null,null,null,null)),(l()(),s.ɵted(null,["\n    "])),(l()(),s.ɵeld(0,null,null,3,"div",[["class","vclTabPanel"],["role","tabpanel"]],null,null,null,null,null)),(l()(),s.ɵted(null,["\n      "])),(l()(),s.ɵeld(16777216,[[1,3],["tabContent",1]],null,0,"div",[],null,null,null,null,null)),(l()(),s.ɵted(null,["\n    "])),(l()(),s.ɵted(null,["\n    "])),(l()(),s.ɵeld(0,null,null,3,"div",[["class","vclTabPanel"],["role","tabpanel"]],null,null,null,null,null)),(l()(),s.ɵted(null,["\n      "])),s.ɵncd(null,0),(l()(),s.ɵted(null,["\n    "])),(l()(),s.ɵted(null,["\n  "])),(l()(),s.ɵted(null,["\n"])),(l()(),s.ɵted(null,["\n"]))],function(l,n){l(n,6,0,n.component.tabs)},function(l,n){var e=n.component;l(n,1,0,s.ɵinlineInterpolate(1,"vclTabbable ",e.tabbableClass,""),"left"===e.layout,"right"===e.layout),l(n,3,0,s.ɵinlineInterpolate(1,"vclTabs ",e.tabsClass,""),!!e.borders),l(n,9,0,s.ɵinlineInterpolate(1,"vclTabContent ",e.tabContentClass,""),!e.borders)})}function a(l){return s.ɵvid(0,[(l()(),s.ɵeld(0,null,null,2,"vcl-tab-nav",[],null,null,null,o,n.RenderType_TabNavComponent)),s.ɵdid(1228800,null,1,i.TabNavComponent,[],null,null),s.ɵqud(603979776,1,{tabs:1})],null,null)}Object.defineProperty(n,"__esModule",{value:!0});var s=e(1),u=e(217),r=e(21),i=e(512),c=[];n.RenderType_TabNavComponent=s.ɵcrt({encapsulation:2,styles:c,data:{}}),n.View_TabNavComponent_0=o,n.TabNavComponentNgFactory=s.ɵccf("vcl-tab-nav",i.TabNavComponent,a,{layout:"layout",tabbableClass:"tabbableClass",tabsClass:"tabsClass",tabContentClass:"tabContentClass",borders:"borders",selectedTabIndex:"selectedTabIndex"},{selectedTabIndexChange:"selectedTabIndexChange"},["*"])},514:function(l,n,e){"use strict";function t(l){return s.ɵvid(0,[s.ɵncd(null,0),(l()(),s.ɵand(0,null,null,0))],null,null)}function o(l){return s.ɵvid(0,[s.ɵqud(402653184,1,{content:0}),(l()(),s.ɵand(0,[[1,2]],null,0,null,t))],null,null)}function a(l){return s.ɵvid(0,[(l()(),s.ɵeld(0,null,null,2,"vcl-tab",[],null,null,null,o,n.RenderType_TabComponent)),s.ɵdid(49152,null,1,u.TabComponent,[],null,null),s.ɵqud(335544320,1,{label:0})],null,null)}Object.defineProperty(n,"__esModule",{value:!0});var s=e(1),u=e(510),r=[];n.RenderType_TabComponent=s.ɵcrt({encapsulation:2,styles:r,data:{}}),n.View_TabComponent_0=o,n.TabComponentNgFactory=s.ɵccf("vcl-tab",u.TabComponent,a,{disabled:"disabled",tabClass:"tabClass"},{},["*"])},515:function(l,n,e){"use strict";function t(l){return b.ɵvid(0,[(l()(),b.ɵted(null,["",""]))],null,function(l,n){l(n,0,0,n.parent.context.$implicit.name)})}function o(l){return b.ɵvid(0,[(l()(),b.ɵeld(16777216,null,null,1,"wormhole",[],null,null,null,null,null)),b.ɵdid(671744,null,0,m.WormholeDirective,[b.ViewContainerRef],{target:[0,"target"]},null),(l()(),b.ɵand(0,null,null,0))],function(l,n){l(n,1,0,n.parent.context.$implicit.content)},null)}function a(l){return b.ɵvid(0,[(l()(),b.ɵeld(0,null,null,2,"div",[],null,null,null,null,null)),(l()(),b.ɵeld(0,null,null,1,"pre",[],null,null,null,null,null)),(l()(),b.ɵted(null,["",""]))],null,function(l,n){l(n,2,0,n.parent.context.$implicit.content)})}function s(l){return b.ɵvid(0,[(l()(),b.ɵeld(0,null,null,0,"div",[],[[8,"innerHTML",1]],null,null,null,null))],null,function(l,n){l(n,0,0,n.parent.context.$implicit.content)})}function u(l){return b.ɵvid(0,[(l()(),b.ɵeld(0,null,null,0,"div",[["class","markdown-body"]],[[8,"innerHTML",1]],null,null,null,null))],null,function(l,n){l(n,0,0,n.parent.context.$implicit.content)})}function r(l){return b.ɵvid(0,[(l()(),b.ɵeld(0,null,null,0,"pre",[],[[8,"innerHTML",1]],null,null,null,null))],null,function(l,n){l(n,0,0,n.parent.context.$implicit.content)})}function i(l){return b.ɵvid(0,[(l()(),b.ɵeld(0,null,null,21,"vcl-tab",[],null,null,null,h.View_TabComponent_0,h.RenderType_TabComponent)),b.ɵdid(49152,[[1,4]],1,f.TabComponent,[],null,null),b.ɵqud(335544320,2,{label:0}),(l()(),b.ɵted(0,["\n      "])),(l()(),b.ɵand(0,[[2,2]],0,1,null,t)),b.ɵdid(16384,null,0,f.TabLabelDirective,[],null,null),(l()(),b.ɵted(0,["\n      "])),(l()(),b.ɵand(16777216,null,0,1,null,o)),b.ɵdid(16384,null,0,v.NgIf,[b.ViewContainerRef,b.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),b.ɵted(0,["\n      "])),(l()(),b.ɵand(16777216,null,0,1,null,a)),b.ɵdid(16384,null,0,v.NgIf,[b.ViewContainerRef,b.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),b.ɵted(0,["\n      "])),(l()(),b.ɵand(16777216,null,0,1,null,s)),b.ɵdid(16384,null,0,v.NgIf,[b.ViewContainerRef,b.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),b.ɵted(0,["\n      "])),(l()(),b.ɵand(16777216,null,0,1,null,u)),b.ɵdid(16384,null,0,v.NgIf,[b.ViewContainerRef,b.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),b.ɵted(0,["\n      "])),(l()(),b.ɵand(16777216,null,0,1,null,r)),b.ɵdid(16384,null,0,v.NgIf,[b.ViewContainerRef,b.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),b.ɵted(0,["\n    "]))],function(l,n){l(n,8,0,"component"===n.context.$implicit.type),l(n,11,0,"text"===n.context.$implicit.type),l(n,14,0,"html"===n.context.$implicit.type),l(n,17,0,"md"===n.context.$implicit.type),l(n,20,0,"pre"===n.context.$implicit.type)},null)}function c(l){return b.ɵvid(0,[(l()(),b.ɵeld(0,null,null,9,"div",[],null,null,null,null,null)),(l()(),b.ɵted(null,["\n  "])),(l()(),b.ɵeld(0,null,null,6,"vcl-tab-nav",[["borders","true"]],null,null,null,C.View_TabNavComponent_0,C.RenderType_TabNavComponent)),b.ɵdid(1228800,null,1,g.TabNavComponent,[],{borders:[0,"borders"]},null),b.ɵqud(603979776,1,{tabs:1}),(l()(),b.ɵted(0,["\n    "])),(l()(),b.ɵand(16777216,null,0,1,null,i)),b.ɵdid(802816,null,0,v.NgForOf,[b.ViewContainerRef,b.TemplateRef,b.IterableDiffers],{ngForOf:[0,"ngForOf"]},null),(l()(),b.ɵted(0,["\n  "])),(l()(),b.ɵted(null,["\n"]))],function(l,n){var e=n.component;l(n,3,0,"true"),l(n,7,0,e.tabs)},null)}function d(l){return b.ɵvid(0,[(l()(),b.ɵeld(0,null,null,1,"h2",[["class","vclArticleHeader"]],null,null,null,null,null)),(l()(),b.ɵted(null,[" ",""])),(l()(),b.ɵted(null,["\n"])),(l()(),b.ɵand(16777216,null,null,1,null,c)),b.ɵdid(16384,null,0,v.NgIf,[b.ViewContainerRef,b.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),b.ɵted(null,["\n"]))],function(l,n){l(n,4,0,n.component.tabs.length>0)},function(l,n){l(n,1,0,n.component.title)})}function p(l){return b.ɵvid(0,[(l()(),b.ɵeld(0,null,null,1,"ng-component",[],null,null,null,d,n.RenderType_DemoComponent)),b.ɵdid(114688,null,0,_.DemoComponent,[L.ActivatedRoute,j.DomSanitizer],null,null)],function(l,n){l(n,1,0)},null)}Object.defineProperty(n,"__esModule",{value:!0});var b=e(1),m=e(217),h=e(514),f=e(510),v=e(21),C=e(513),g=e(512),_=e(511),L=e(32),j=e(22),y=[];n.RenderType_DemoComponent=b.ɵcrt({encapsulation:2,styles:y,data:{}}),n.View_DemoComponent_0=d,n.DemoComponentNgFactory=b.ɵccf("ng-component",_.DemoComponent,p,{},{},[])},516:function(l,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=e(511);n.DemoComponent=t.DemoComponent;var o=function(){function l(){}return l}();n.DemoModule=o},521:function(l,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=function(){function l(){this.disabled=!1,this.requiredIndicatorCharacter="•",this.wrapping=!1,this.required=!1}return l}();n.FormControlLabelComponent=t},537:function(l,n,e){"use strict";function t(l){return u.ɵvid(0,[(l()(),u.ɵeld(0,null,null,2,"em",[["aria-hidden","true"],["class","vclRequiredIndicator"]],[[1,"aria-label",0]],null,null,null,null)),u.ɵpid(131072,r.L10nPipe,[[2,i.L10nService]]),(l()(),u.ɵted(null,["\n  ","\n"]))],null,function(l,n){var e=n.component;l(n,0,0,u.ɵunv(n,0,0,u.ɵnov(n,1).transform(e.requiredIndLabel))),l(n,2,0,e.requiredIndicatorCharacter)})}function o(l){return u.ɵvid(0,[(l()(),u.ɵeld(0,null,null,2,"span",[["class","vclFormControlSubLabel"]],null,null,null,null,null)),(l()(),u.ɵted(null,["",""])),u.ɵpid(131072,r.L10nPipe,[[2,i.L10nService]])],null,function(l,n){var e=n.component;l(n,1,0,u.ɵunv(n,1,0,u.ɵnov(n,2).transform(e.subLabel)))})}function a(l){return u.ɵvid(2,[u.ɵqud(402653184,1,{content:0}),(l()(),u.ɵted(null,["","\n"])),u.ɵpid(131072,r.L10nPipe,[[2,i.L10nService]]),(l()(),u.ɵand(16777216,null,null,1,null,t)),u.ɵdid(16384,null,0,c.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),u.ɵted(null,["\n"])),(l()(),u.ɵand(16777216,null,null,1,null,o)),u.ɵdid(16384,null,0,c.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),u.ɵted(null,["\n"])),(l()(),u.ɵted(null,["\n"])),u.ɵncd(null,0),(l()(),u.ɵted(null,["\n"]))],function(l,n){var e=n.component;l(n,4,0,e.required),l(n,7,0,e.subLabel)},function(l,n){var e=n.component;l(n,1,0,u.ɵunv(n,1,0,u.ɵnov(n,2).transform(e.label)))})}function s(l){return u.ɵvid(0,[(l()(),u.ɵeld(0,null,null,1,"label",[["vcl-form-control-label",""]],[[2,"vclFormControlLabel",null],[2,"vclDisabled",null],[2,"vclFormControlLabelWrapping",null]],null,null,a,n.RenderType_FormControlLabelComponent)),u.ɵdid(49152,null,0,d.FormControlLabelComponent,[],null,null)],null,function(l,n){l(n,0,0,!0,u.ɵnov(n,1).disabled,u.ɵnov(n,1).wrapping)})}Object.defineProperty(n,"__esModule",{value:!0});var u=e(1),r=e(126),i=e(50),c=e(21),d=e(521),p=[];n.RenderType_FormControlLabelComponent=u.ɵcrt({encapsulation:2,styles:p,data:{}}),n.View_FormControlLabelComponent_0=a,n.FormControlLabelComponentNgFactory=u.ɵccf("label[vcl-form-control-label]",d.FormControlLabelComponent,s,{disabled:"disabled",requiredIndicatorCharacter:"requiredIndicatorCharacter",label:"label",subLabel:"subLabel",wrapping:"wrapping",required:"required",requiredIndLabel:"requiredIndLabel"},{},["*"])},795:function(l,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=function(){function l(){}return l.prototype.onButtonClick=function(){console.log("onButtonTap")},l}();n.FormControlLabelDemoComponent=t},837:function(l,n,e){"use strict";function t(l){return a.ɵvid(0,[(l()(),a.ɵeld(0,null,null,1,"h3",[],null,null,null,null,null)),(l()(),a.ɵted(null,["Non-wrapping label:"])),(l()(),a.ɵted(null,["\n"])),(l()(),a.ɵeld(0,null,null,1,"label",[["for","form-control-label-demo-checkbox-1"],["label","Label 1"],["subLabel","Sub label 1"],["vcl-form-control-label",""]],[[2,"vclFormControlLabel",null],[2,"vclDisabled",null],[2,"vclFormControlLabelWrapping",null]],null,null,s.View_FormControlLabelComponent_0,s.RenderType_FormControlLabelComponent)),a.ɵdid(49152,null,0,u.FormControlLabelComponent,[],{label:[0,"label"],subLabel:[1,"subLabel"]},null),(l()(),a.ɵted(null,["\n"])),(l()(),a.ɵeld(0,null,null,2,"button",[["id","form-control-label-demo-checkbox-1"],["label","ClickMe!"],["vcl-button",""]],[[2,"vclButton",null],[2,"vclHovered",null],[1,"disabled",0],[2,"vclSelected",null],[1,"aria-label",0]],[[null,"click"],[null,"keypress"],[null,"mouseenter"],[null,"mouseleave"],[null,"mouseup"],[null,"mousedown"],[null,"onfocus"],[null,"onblur"],[null,"tap"]],function(l,n,e){var t=!0,o=l.component;if("keypress"===n){t=!1!==a.ɵnov(l,7).onKeypress(e)&&t}if("mouseenter"===n){t=!1!==a.ɵnov(l,7).onMouseEnter(e)&&t}if("mouseleave"===n){t=!1!==a.ɵnov(l,7).onMouseLeave(e)&&t}if("mouseup"===n){t=!1!==a.ɵnov(l,7).onMouseUp(e)&&t}if("mousedown"===n){t=!1!==a.ɵnov(l,7).onMouseDown(e)&&t}if("onfocus"===n){t=!1!==a.ɵnov(l,7).onFocus(e)&&t}if("onblur"===n){t=!1!==a.ɵnov(l,7).onBlur(e)&&t}if("tap"===n){t=!1!==a.ɵnov(l,7).onTap(e)&&t}if("click"===n){t=!1!==a.ɵnov(l,7).onClick(e)&&t}if("click"===n){t=!1!==o.onButtonClick()&&t}return t},i.View_ButtonComponent_0,i.RenderType_ButtonComponent)),a.ɵdid(4898816,null,1,c.ButtonComponent,[a.ElementRef],{label:[0,"label"]},null),a.ɵqud(603979776,1,{buttonContent:1}),(l()(),a.ɵted(null,["\n\n"])),(l()(),a.ɵeld(0,null,null,1,"h3",[],null,null,null,null,null)),(l()(),a.ɵted(null,["Wrapping label:"])),(l()(),a.ɵted(null,["\n\n"])),(l()(),a.ɵeld(0,null,null,6,"label",[["label","Label 2"],["subLabel","Sub label 2"],["vcl-form-control-label",""]],[[2,"vclFormControlLabel",null],[2,"vclDisabled",null],[2,"vclFormControlLabelWrapping",null]],null,null,s.View_FormControlLabelComponent_0,s.RenderType_FormControlLabelComponent)),a.ɵdid(49152,null,0,u.FormControlLabelComponent,[],{label:[0,"label"],subLabel:[1,"subLabel"],wrapping:[2,"wrapping"]},null),(l()(),a.ɵted(0,["\n  "])),(l()(),a.ɵeld(0,null,0,2,"button",[["id","form-control-label-demo-checkbox-1"],["label","ClickMe!"],["vcl-button",""]],[[2,"vclButton",null],[2,"vclHovered",null],[1,"disabled",0],[2,"vclSelected",null],[1,"aria-label",0]],[[null,"click"],[null,"keypress"],[null,"mouseenter"],[null,"mouseleave"],[null,"mouseup"],[null,"mousedown"],[null,"onfocus"],[null,"onblur"],[null,"tap"]],function(l,n,e){var t=!0,o=l.component;if("keypress"===n){t=!1!==a.ɵnov(l,17).onKeypress(e)&&t}if("mouseenter"===n){t=!1!==a.ɵnov(l,17).onMouseEnter(e)&&t}if("mouseleave"===n){t=!1!==a.ɵnov(l,17).onMouseLeave(e)&&t}if("mouseup"===n){t=!1!==a.ɵnov(l,17).onMouseUp(e)&&t}if("mousedown"===n){t=!1!==a.ɵnov(l,17).onMouseDown(e)&&t}if("onfocus"===n){t=!1!==a.ɵnov(l,17).onFocus(e)&&t}if("onblur"===n){t=!1!==a.ɵnov(l,17).onBlur(e)&&t}if("tap"===n){t=!1!==a.ɵnov(l,17).onTap(e)&&t}if("click"===n){t=!1!==a.ɵnov(l,17).onClick(e)&&t}if("click"===n){t=!1!==o.onButtonClick()&&t}return t},i.View_ButtonComponent_0,i.RenderType_ButtonComponent)),a.ɵdid(4898816,null,1,c.ButtonComponent,[a.ElementRef],{label:[0,"label"]},null),a.ɵqud(603979776,2,{buttonContent:1}),(l()(),a.ɵted(0,["\n"])),(l()(),a.ɵted(null,["\n\n"])),(l()(),a.ɵeld(0,null,null,1,"h3",[],null,null,null,null,null)),(l()(),a.ɵted(null,["Disabled label:"])),(l()(),a.ɵted(null,["\n"])),(l()(),a.ɵeld(0,null,null,1,"label",[["disabled","true"],["label","Label 3 (disabled)"],["vcl-form-control-label",""]],[[2,"vclFormControlLabel",null],[2,"vclDisabled",null],[2,"vclFormControlLabelWrapping",null]],null,null,s.View_FormControlLabelComponent_0,s.RenderType_FormControlLabelComponent)),a.ɵdid(49152,null,0,u.FormControlLabelComponent,[],{disabled:[0,"disabled"],label:[1,"label"]},null),(l()(),a.ɵted(null,["\n\n"])),(l()(),a.ɵeld(0,null,null,1,"h3",[],null,null,null,null,null)),(l()(),a.ɵted(null,["Required label:"])),(l()(),a.ɵted(null,["\n"])),(l()(),a.ɵeld(0,null,null,1,"label",[["label","Label 4 (required)"],["required","true"],["requiredIndLabel","reqLabel"],["vcl-form-control-label",""]],[[2,"vclFormControlLabel",null],[2,"vclDisabled",null],[2,"vclFormControlLabelWrapping",null]],null,null,s.View_FormControlLabelComponent_0,s.RenderType_FormControlLabelComponent)),a.ɵdid(49152,null,0,u.FormControlLabelComponent,[],{label:[0,"label"],required:[1,"required"],requiredIndLabel:[2,"requiredIndLabel"]},null),(l()(),a.ɵted(null,["\n"]))],function(l,n){l(n,4,0,"Label 1","Sub label 1");l(n,7,0,"ClickMe!");l(n,14,0,"Label 2","Sub label 2",!0);l(n,17,0,"ClickMe!");l(n,25,0,"true","Label 3 (disabled)");l(n,31,0,"Label 4 (required)","true","reqLabel")},function(l,n){l(n,3,0,!0,a.ɵnov(n,4).disabled,a.ɵnov(n,4).wrapping);l(n,6,0,!0,a.ɵnov(n,7).hovered,a.ɵnov(n,7).isDisabled,a.ɵnov(n,7).selected,a.ɵnov(n,7).title);l(n,13,0,!0,a.ɵnov(n,14).disabled,a.ɵnov(n,14).wrapping);l(n,16,0,!0,a.ɵnov(n,17).hovered,a.ɵnov(n,17).isDisabled,a.ɵnov(n,17).selected,a.ɵnov(n,17).title);l(n,24,0,!0,a.ɵnov(n,25).disabled,a.ɵnov(n,25).wrapping);l(n,30,0,!0,a.ɵnov(n,31).disabled,a.ɵnov(n,31).wrapping)})}function o(l){return a.ɵvid(0,[(l()(),a.ɵeld(0,null,null,1,"ng-component",[],null,null,null,t,n.RenderType_FormControlLabelDemoComponent)),a.ɵdid(49152,null,0,r.FormControlLabelDemoComponent,[],null,null)],null,null)}Object.defineProperty(n,"__esModule",{value:!0});var a=e(1),s=e(537),u=e(521),r=e(795),i=e(219),c=e(78),d=[];n.RenderType_FormControlLabelDemoComponent=a.ɵcrt({encapsulation:2,styles:d,data:{}}),n.View_FormControlLabelDemoComponent_0=t,n.FormControlLabelDemoComponentNgFactory=a.ɵccf("ng-component",r.FormControlLabelDemoComponent,o,{},{},[])},884:function(l,n,e){"use strict";function t(){return{name:"Form Control Label",tabs:{Demo:o.FormControlLabelDemoComponent,"README.md":{type:"md",content:e(993)},"demo.component.html":{type:"pre",content:e(922)},"demo.component.ts":{type:"pre",content:e(957)}}}}Object.defineProperty(n,"__esModule",{value:!0});var o=e(795);n.demo=t;var a=function(){function l(){}return l}();n.FormControlLabelDemoModule=a},922:function(l,n){l.exports='<span class="hljs-tag">&lt;<span class="hljs-name">h3</span>&gt;</span>Non-wrapping label:<span class="hljs-tag">&lt;/<span class="hljs-name">h3</span>&gt;</span>\n<span class="hljs-tag">&lt;<span class="hljs-name">label</span> <span class="hljs-attr">vcl-form-control-label</span> <span class="hljs-attr">label</span>=<span class="hljs-string">"Label 1"</span> <span class="hljs-attr">subLabel</span>=<span class="hljs-string">"Sub label 1"</span> <span class="hljs-attr">for</span>=<span class="hljs-string">"form-control-label-demo-checkbox-1"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>\n<span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">vcl-button</span> <span class="hljs-attr">id</span>=<span class="hljs-string">"form-control-label-demo-checkbox-1"</span> <span class="hljs-attr">label</span>=<span class="hljs-string">"ClickMe!"</span> (<span class="hljs-attr">click</span>)=<span class="hljs-string">"onButtonClick()"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>\n\n<span class="hljs-tag">&lt;<span class="hljs-name">h3</span>&gt;</span>Wrapping label:<span class="hljs-tag">&lt;/<span class="hljs-name">h3</span>&gt;</span>\n\n<span class="hljs-tag">&lt;<span class="hljs-name">label</span> <span class="hljs-attr">vcl-form-control-label</span> <span class="hljs-attr">label</span>=<span class="hljs-string">"Label 2"</span> <span class="hljs-attr">subLabel</span>=<span class="hljs-string">"Sub label 2"</span> [<span class="hljs-attr">wrapping</span>]=<span class="hljs-string">"true"</span>&gt;</span>\n  <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">vcl-button</span> <span class="hljs-attr">id</span>=<span class="hljs-string">"form-control-label-demo-checkbox-1"</span> <span class="hljs-attr">label</span>=<span class="hljs-string">"ClickMe!"</span> (<span class="hljs-attr">click</span>)=<span class="hljs-string">"onButtonClick()"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>\n<span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>\n\n<span class="hljs-tag">&lt;<span class="hljs-name">h3</span>&gt;</span>Disabled label:<span class="hljs-tag">&lt;/<span class="hljs-name">h3</span>&gt;</span>\n<span class="hljs-tag">&lt;<span class="hljs-name">label</span> <span class="hljs-attr">vcl-form-control-label</span> <span class="hljs-attr">label</span>=<span class="hljs-string">"Label 3 (disabled)"</span> <span class="hljs-attr">disabled</span>=<span class="hljs-string">true</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>\n\n<span class="hljs-tag">&lt;<span class="hljs-name">h3</span>&gt;</span>Required label:<span class="hljs-tag">&lt;/<span class="hljs-name">h3</span>&gt;</span>\n<span class="hljs-tag">&lt;<span class="hljs-name">label</span> <span class="hljs-attr">vcl-form-control-label</span> <span class="hljs-attr">label</span>=<span class="hljs-string">"Label 4 (required)"</span> <span class="hljs-attr">required</span>=<span class="hljs-string">true</span> <span class="hljs-attr">requiredIndLabel</span>=<span class="hljs-string">"reqLabel"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>\n'},957:function(l,n){l.exports='<span class="hljs-keyword">import</span> { Component, OnInit } <span class="hljs-keyword">from</span> <span class="hljs-string">\'@angular/core\'</span>;\n\n<span class="hljs-meta">@Component</span>({\n  templateUrl: <span class="hljs-string">\'demo.component.html\'</span>\n})\n<span class="hljs-keyword">export</span> <span class="hljs-keyword">class</span> FormControlLabelDemoComponent {\n  onButtonClick() {\n    <span class="hljs-built_in">console</span>.log(<span class="hljs-string">\'onButtonTap\'</span>);\n  }\n}\n'},993:function(l,n){l.exports='<h1 id="vcl-form-control-label">vcl-form-control-label</h1>\n<p>Label to describe form controls.</p>\n<h2 id="usage-">Usage:</h2>\n<p>Non-wrapping label</p>\n<pre class="hljs"><span class="hljs-tag">&lt;<span class="hljs-name">label</span> <span class="hljs-attr">vcl-form-control-label</span> <span class="hljs-attr">label</span>=<span class="hljs-string">&quot;Label text&quot;</span> <span class="hljs-attr">subLabel</span>=<span class="hljs-string">&quot;Sub label text&quot;</span> <span class="hljs-attr">for</span>=<span class="hljs-string">&quot;...&quot;</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>\n</pre>\n<p>Wrapping label</p>\n<pre class="hljs"><span class="hljs-tag">&lt;<span class="hljs-name">label</span> <span class="hljs-attr">vcl-form-control-label</span> <span class="hljs-attr">label</span>=<span class="hljs-string">&quot;Label text&quot;</span> <span class="hljs-attr">subLabel</span>=<span class="hljs-string">&quot;Sub label text&quot;</span>&gt;</span>\n  ...\n<span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>\n</pre>\n<h3 id="api">API</h3>\n<h4 id="properties-">Properties:</h4>\n<table>\n<thead>\n<tr>\n<th>Name</th>\n<th>Type</th>\n<th>Default</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>label</code> <em>(1)</em></td>\n<td>string</td>\n<td></td>\n<td>The label </td>\n</tr>\n<tr>\n<td><code>subLabel</code> <em>(1)</em></td>\n<td>string</td>\n<td></td>\n<td>The sublabel </td>\n</tr>\n<tr>\n<td><code>disabled</code></td>\n<td>boolean</td>\n<td>false</td>\n<td>Whether the label is disabled or not</td>\n</tr>\n<tr>\n<td><code>required</code></td>\n<td>boolean</td>\n<td>false</td>\n<td>Shows the required indicator when true</td>\n</tr>\n<tr>\n<td><code>requiredIndicatorCharacter</code></td>\n<td>string</td>\n<td>&#x2022;</td>\n<td>The required indicator character</td>\n</tr>\n<tr>\n<td><code>requiredIndLabel</code> <em>(1)</em></td>\n<td>string</td>\n<td></td>\n<td>Accessible label for the required indicator</td>\n</tr>\n</tbody>\n</table>\n<p><em>(1) Supports l10n</em></p>\n'}});
//# sourceMappingURL=17.map