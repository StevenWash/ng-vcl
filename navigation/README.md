# vcl-navigation
The nav allows to organize navigation-items.


## Usage:

```js
import { VCLNavigationModule } from 'ng-vcl';

@NgModule({
  imports: [ VCLNavigationModule ],
  ...
})
export class AppComponent {}
```

```html
<vcl-navigation #nav1 (navigate)="onNavigate($event)">
  <vcl-navitem  label="Home1" prepIcon="fa:home" [route]="['/']"></vcl-navitem>
  <vcl-navitem label="Products" prepIcon="fa:bicycle" [route]="['/products']"></vcl-navitem>  
  <vcl-navitem label="Contact" prepIcon="fa:contact" [route]="['/contact']"></vcl-navitem>
</vcl-navigation>
```

##Nested:
```html
<vcl-navigation #nav2 type="vertical" (navigate)="onNavigate($event)">
  <vcl-navitem  label="Home1" [route]="['/']"></vcl-navitem>
  <vcl-navitem label="Products" appIcon="fa:bicycle">
    <vcl-navitem label="Product 1" [route]="['/product', 1]"></vcl-navitem>  
    <vcl-navitem label="Product 2" [route]="['/product', 2]"></vcl-navitem>  
  </vcl-navitem>  
  <vcl-navitem label="Contact" [route]="['/contact']"></vcl-navitem>
</vcl-navigation>
```



### API

#### vcl-navigation attributes:

| Name                     | Type          | Default            | Description                                |
| ------------             | ------------- | ------------------ |--------------------------------------------|
| `ariaRole`               | string        |                    |                                            |
| `tabindex`               | number        |                  0 |                                            |
| `useRouter`              | boolean       |              false | Uses the router for navigation if true     |
| `type`                   | string        |       'horizontal' | Direction (horizontal or vertical)         |
| `subLevelHintIconClosed` | string        | 'fa:chevron-right' | Icon for nested closed                     |
| `subLevelHintIconOpened` | string        |  'fa:chevron-down' | Icon for nested opened                     |
| `subLevelHintIconSide`   | string        |             'left' | The side the icon be displayed             |



#### vcl-navitem attributes:

| Name                     | Type        | Default  | Description                                   |
| ------------------------ | ----------- | -------- |-----------------------------------------------|

| `label`                  | string      |         | Label of this item                             |
| `route`                  | any[]       |         | Route which is used onSelect                   |
| `opened`                 | boolean     | false   | if true and nested this opens the subitems     |
| `heading`                | boolean     | false   | if true, this is used as hX                    |
| `prepIcon`               | string      |         |                                                |
| `appIcon`                | string      |         | icon which should be displayed                 |
| `class`                  | string      |         | any css-classes which will be added            |
