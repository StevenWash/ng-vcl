# Changelog

## master

## 2017-01-20 - [71a9050](https://github.com/ng-vcl/ng-vcl/commit/71a90504c2d422599bf7bf289c54ea795641459c)

### Breaking Changes
- vcl-month-picker:
  - removed `@Input() useShortNames: boolean`, month names now default to short names, to use long month names, see `dateOptions` changes (have to pass in `{ month: 'long' }`)
  
### Changes
- vcl-month-picker:
  - introduced `@Input() locales: input: string | string[]`, see [Date.toLocaleDateString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) first parameter
  - introduced `@Input() dateOptions: any`, see [Date.toLocaleDateString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString) second parameter
 
## 2017-01-17 - e3c8f1f 

### Breaking Changes
- vcl-dropdown: see [readme](https://github.com/ng-vcl/ng-vcl/blob/master/src/components/dropdown/README.md)
  - "select"-event is now "change"
  - the select-event returns now an value-array instead of the items
  - items behave like [html5-options](http://www.w3schools.com/tags/tag_select.asp)
- layer:
  - name reference support removed
  - introduce component layers and LayerRefs

### Changes:
  - added vcl-alert
  - added vcl-busy
  - added vcl-growl
  - added vcl-file-input
  - select no longer uses tether

### Bugfixes

## 2016-12-14 - 15979eb

### Breaking Changes
- angular >= 2.3.0 required   
- vcl-layer: The `<vcl-layer-base>` it added automatically to the app root   
- wormhole: Renamed directives to `wormhole`/`connectWormhole`