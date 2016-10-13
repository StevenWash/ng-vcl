import { SelectComponent } from './select.component';

export default {
  name: 'Select',
  path: 'select',
  tabs: {
    Demo: SelectComponent,
    'demo.component.html': require("!raw!./select.component.html"),
    'demo.component.ts': require("!raw!./select.component.ts")
  }
};