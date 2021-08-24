# ScandiPWA Page Builder extension

### Third party dependencies:

None

## Details

### Idea

1. Try to keep the same HTML code from page-builder (including all data attributes, classes, props)
2. Migrate .less files of page-builder module to .sass files. Override them with our sass var/mixin to have the same UI style as ScandiPWA
3. Components those communicate with JS: slider, google map, tab,... Magento page-builder is relying on custom-data-attribute and jquery to handle them.
   We're going to migrate just necessary parts from them to React components, and use React to manipulate these element
   


### Here is a simple example for migrating `Buttons group` which contains a `Button` components:

#### HTML code output from magento (A):

```html
<div data-content-type="buttons" data-appearance="stacked" data-same-width="true" data-element="main"
     data-pb-style="S40BBHB">
  <div data-content-type="button-item" data-appearance="default" data-element="main" data-pb-style="EIYNMYO">
    <div class="pagebuilder-button-primary" data-element="empty_link" data-pb-style="SDV0H76" style="min-width: 221px;">
      <span data-element="link_text">same width and stack btn</span></div>
  </div>
</div>
```

#### React component generator helper:
Thanks to this function, we can migrate above code to individual React Components:
`packages/page-builder/src/plugin/Html.component.plugin.js:toReactElements()`

```jsx
render() {
    const { BaseButtons, Button } = this.props.elements;

    return <BaseButtons.Ele>
      <Button.Ele>{Button.childEleBag}</Button.Ele>
    </BaseButtons.Ele>
  }
```

After having above React components, we can freely do whatever we want with them 


#### And HTML code output from it:
```html
Same as (A)!
```

