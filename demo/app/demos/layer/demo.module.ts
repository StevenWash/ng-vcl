import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VCLLayerModule, VCLButtonModule, VCLWormholeModule } from '@ng-vcl/ng-vcl';
import { DemoModule, DemoComponent } from './../../modules/demo/demo.module';
import { LayerDemoComponent } from './demo.component';
import { FooLayer, FooComponent } from './foo.layer';
import { LayerDemoCanDeactivateGuard } from './demo.guard';

export function demo() {
  return {
    label: 'Layer',
    tabs: {
      Demo: LayerDemoComponent,
      'README.md': {
        type: 'md',
        content: require("raw-loader!highlight-loader?!markdown-loader?breaks=true!@ng-vcl/ng-vcl/layer/README.md")
      },
      'demo.component.html': {
        type: 'pre',
        content: require("!highlight-loader?raw=true&lang=html!./demo.component.html")
      },
      'demo.component.ts': {
        type: 'pre',
        content: require("!highlight-loader?raw=true&lang=ts!./demo.component.ts")
      },
      'demo.guard.ts': {
        type: 'pre',
        content: require("!highlight-loader?raw=true&lang=ts!./demo.guard.ts")
      },
      'foo.layer.html': {
        type: 'pre',
        content: require("!highlight-loader?raw=true&lang=html!./foo.layer.html")
      },
      'foo.layer.ts': {
        type: 'pre',
        content: require("!highlight-loader?raw=true&lang=ts!./foo.layer.ts")
      }
    },
  };
}

@NgModule({
  imports: [
    CommonModule,
    DemoModule,
    VCLLayerModule.forChild({layers: [FooLayer]}),
    VCLButtonModule,
    RouterModule.forChild([{
      path: '',
      component: DemoComponent,
      data: {demo},
      canDeactivate: [LayerDemoCanDeactivateGuard],
    }]),
  ],
  providers: [
    LayerDemoCanDeactivateGuard
  ],
  entryComponents: [
    LayerDemoComponent,
    FooComponent
  ],
  declarations: [
    LayerDemoComponent,
    FooComponent
  ]
})
export class LayerDemoModule { }

