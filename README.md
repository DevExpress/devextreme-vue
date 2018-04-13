# DevExtreme Vue UI and Visualization Components #

[![Run Status](https://api.shippable.com/projects/5ab4c6354a24a207009ec636/badge?branch=master)](https://app.shippable.com/github/DevExpress/devextreme-vue)
[![NPM](https://img.shields.io/npm/v/devextreme-vue.svg?maxAge=43200)](https://www.npmjs.com/package/devextreme-vue)

![Project Status](https://img.shields.io/badge/Project%20Status-alpha-orange.svg?maxAge=43200)

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) as [Vue](https://vuejs.org) Components.


* [Getting started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Install DevExtreme](#installation)
  * [Use DevExtreme Components](#use-components)
  * [API Reference](#api-reference)
* [Component Configuration](#component-configuration)
  * [Set Component Option](#component-option)
  * [Two-way Binding](#two-way-binding)
  * [Editors Value Binding](#editors-value-binding)
  * [Custom templates](#custom-templates)
  * [Components with Transcluded Content](#components-with-transcluded-content)
  * [Event Handling](#event-handling)
* [Type Checks](#type-checks)
* [DevExtreme Data Layer and Utils](#data-layer-and-utils)
* [License](#license)
* [Support & feedback](#support-feedback)
## <a name="getting-started"></a>Getting Started ##
### <a name="prerequisites"></a>Prerequisites ###
[Node.js and npm](https://docs.npmjs.com/getting-started/installing-node) are required

### <a name="installation"></a>Install DevExtreme ###

Install the **devextreme** and **devextreme-vue** npm packages:

```console
npm install --save devextreme@18.1-unstable devextreme-vue
```

### <a name="import_devextreme_modules"></a>Import DevExtreme Modules and Themes  ###

Import DevExtreme modules in a DevExtreme component's file.

```js
import { DxButton } from 'devextreme-vue';
```

DevExtreme themes can be imported only once in your application's main file:

```js
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';
```

See the [Predefined Themes](https://js.devexpress.com/Documentation/Guide/Themes/Predefined_Themes/#Themes_in_Sites) guide for more information on DevExtreme themes.


### <a name="use-components"></a>Use DevExtreme Components  ###

You can use DevExtreme components in a [single file component](https://vuejs.org/v2/guide/single-file-components.html)

```html
<template>
    <dx-button :text='text'/>
</template>

<script>
import { DxButton } from 'devextreme-vue';
export default {
  name: 'HelloWorld',
  data() {
    return {
      text: 'Hello!'
    };
  },
  components: {
    DxButton
  }
};
</script>
```

... in a [jsx](https://vuejs.org/v2/guide/render-function.html#JSX) render function

```jsx
import Vue from 'vue';
import { DxButton } from 'devextreme-vue';


new Vue({
  el: '#app',
  data: function() {
    return {
      text: "Hello!"
    }
  },
  render: function(h) {
    return (
      <DxButton text={this.text} />
    )
  }
});

```

... or directly in a vue template

```
new Vue({
  el: '#app',
  components: { DxButton },
  template: '<dx-button :text="text" />',
  data() {
    return {
      text: 'Hello!'
    };
  }
});

```

## <a name="api-reference"></a>API Reference ##

DevExtreme Vue components mirror [DevExtreme JavaScript API](http://js.devexpress.com/Documentation/ApiReference/) but use Vue syntax for specifying widget options, subscribing to events and custom template declaration.

## <a name="component-configuration"></a>Component Configuration ##

###  <a name="component-option"></a>Set Component Option ### 
- A constant string value (for example, the Button [text](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Configuration/#text)):

 ```html
 <dx-button text="Simple button" />
 ```
 
 - A constant non-string value (for example, the CheckBox [value](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxCheckBox/Configuration/#value)):

 ```html
 <dx-check-box :value="true" />
 ```

- A value from a component data:

 ```html
 <dx-button :text="text" />
 ```
 where `:` is a shorthand for [`v-bind` directive](https://vuejs.org/v2/api/#v-bind).

### <a name="two-way-binding"></a>Two-way Binding ###

Use the [`sync`](https://vuejs.org/v2/guide/components-custom-events.html#sync-Modifier) modifier to bind a `bindingProperty` to a widget option:

```html
<dx-text-box :value.sync="bindingProperty" />
```

###  <a name="editor-value-binding"></a>Editors Value Binding ###
The DevExtreme Vue editors also support [`v-model`](https://vuejs.org/v2/guide/forms.html) directive that creates two-way binding on the editor's value (for example, TextBox [value](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#value)):

```html
<dx-text-box v-model="text" />
```

### <a name="custom-templates"></a>Custom templates ###
You can customize widget elements' appearance via the corresponding template properties. 

To specify a DevExtreme Vue Component template, use a [named slot](https://vuejs.org/v2/guide/components-slots.html#Named-Slots) to specify a template markup. You also should specify a [slot scope](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to access the template element data.

For instance, you can specify the itemTemplate:

```html
<div id="app">
    <dx-list :items="items">
        <template slot="item" slot-scope="data">
            <i>This is my template for {{data}}</i>
        </template>
    </dx-list>
</div>
```

```js
import Vue from 'vue';
import { DxList } from 'devextreme-vue';

new Vue({
  el: '#app',
  components: { DxList },
  data() {
    return {
      items: [1, 2, 3, 4]
    };
  }
});

```

`item` is the default template name of the dxList widget's `itemTemplate` option. You can specify a custom name for the `itemTemplate` option and for your `slot`:

```html
<div id="app">
    <dx-list :items="items" itemTemplate="my-template">
        <template slot="my-template" slot-scope="data">
            <i>This is my template for {{data}}</i>
        </template>
    </dx-list>
</div>
```

Note that in a single file component, you cannot use the `<template>` tag for a slot element (currently not allowed in Vue). Use `<div>` instead:

```html
<template>
    <dx-list :items="items">
        <div slot="item" slot-scope="data">
            <i>This is my template for {{data}}</i>
        </div>
    </dx-list>
</template>
```

### <a name="components-with-transcluded-content"></a>Components with Transcluded Content ##

In addition to using templates, you can put the following widgets' content directly into the markup:
[Resizable](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxResizable/),
[ScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/),
[ValidationGroup](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxValidationGroup/).
For instance, you can specify the [ScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/) widget's content as follows:

```html
<dx-scroll-view>
    <div>Some scrollable content</div>
</dx-scroll-view>
```

### <a name="event-handling"></a>Event Handling ###
You can subscribe to DevExtreme Component Events using the Vue's [`v-on` directive](https://vuejs.org/v2/guide/events.html) (or `@` shorthand)

```html
<dx-text-box v-model="text" @focusIn="handleFocusIn'" />
```
```js
data: function() {
  return {
    text: "text",
    handleFocusIn: () => {
      this.text = 'focused!';
    }
  };
}
```

You can find the full list of component events in each DevExtreme widget API Reference's Events section (for example, [TextBox events](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxTextBox/Events/)).

## <a name="type-checks"></a>Type Checks ##
DevExtreme Vue components provide [Prop Validation and Type Checks](https://vuejs.org/v2/guide/components-props.html#Prop-Validation), which means that you should specify proper values for the components' properties. Otherwise, Vue produces a console warning (if you are using the development build).

## <a name="data-layer-and-utils"></a>DevExtreme Data Layer and Utils ##
The DevExtreme includes a [Data Layer](https://js.devexpress.com/Documentation/Guide/Data_Layer/Data_Layer/) and [Utils](https://js.devexpress.com/Documentation/ApiReference/Common/utils/) that can be helpful in different scenarios.


## <a name="license"></a>License ##

**DevExtreme Vue components are released as an MIT-licensed (free and open-source) add-on to DevExtreme.**

Familiarize yourself with the [DevExtreme License](https://js.devexpress.com/Licensing/).

[A free trial is available!](http://js.devexpress.com/Buy/)

## <a name="support-feedback"></a>Support & Feedback ##
* Check the [Vue Guide](https://vuejs.org/v2/guide/) for general Vue questions
* For questions regarding DevExtreme libraries and widgets' APIs, use the [DevExpress Support Center](https://www.devexpress.com/Support/Center)
