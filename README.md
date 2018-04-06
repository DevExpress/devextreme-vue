# DevExtreme Vue UI and Visualization Components #

[![Run Status](https://api.shippable.com/projects/5ab4c6354a24a207009ec636/badge?branch=master)](https://app.shippable.com/github/DevExpress/devextreme-vue)

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

### <a name="use-components"></a>Use DevExtreme Components  ###

```js
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';

import Vue from 'vue';
import { DxButton } from 'devextreme-vue';

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

Note that a [predefined theme](https://js.devexpress.com/Documentation/Guide/Themes/Predefined_Themes/) is required.

You can also use DevExtreme Vue Components inside a [single file component](https://vuejs.org/v2/guide/single-file-components.html):
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

Or with [jsx](https://vuejs.org/v2/guide/render-function.html#JSX) render function:
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
## <a name="api-reference"></a>API Reference ##

The complete list of components and their APIs are described in the [DevExtreme API Reference](http://js.devexpress.com/Documentation/ApiReference/).

## <a name="component-configuration"></a>Component Configuration ##

###  <a name="component-option"></a>Set Component Option ### 
To set a constant value
(e.g. the Button [text](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Configuration/#text)):

```html
<dx-button text="Simple button" />
```
You can also use a value from a component data:

```html
<dx-button :text="text" />
```
where `:` is a shorthand for [`v-bind` directive](https://vuejs.org/v2/api/#v-bind).

### <a name="two-way-binding"></a>Two-way Binding ###

To bind some `bindingProperty` to a widget option use [`sync`](https://vuejs.org/v2/guide/components-custom-events.html#sync-Modifier) modifier:

```html
<dx-text-box :value.sync="bindingProperty" />
```

###  <a name="editor-value-binding"></a>Editors Value Binding ###
The DevExtreme Vue editors also support [`v-model`](https://vuejs.org/v2/guide/forms.html) directive which create two-way binding on the editor's value (e.g. TextBox [value](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#value))

```html
<dx-text-box v-model="text" />
```

### <a name="custom-templates"></a>Custom templates ###
You can customize widget elements' appearance via the corresponding template properties. 

To specify a DevExtreme Vue Component template, use the [named slot](https://vuejs.org/v2/guide/components-slots.html#Named-Slots) to set a template markup. You also should specify a [slot scope](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to get access to the data of the template element.

For instance, we can specify the itemTemplate:

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
The `item` name is default template name for the `itemTemplate` option of the dxList widget. You can set your own name for the `itemTemplate` option and for your `slot`:

```html
<div id="app">
    <dx-list :items="items" itemTemplate="my-template">
        <template slot="my-template" slot-scope="data">
            <i>This is my template for {{data}}</i>
        </template>
    </dx-list>
</div>
```

Note that in single file component, you can't use `<template>` tag for slot element (currently not allowed in Vue). Use `<div>` instead:

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

In addition to using templates, it is possible to put the content of the following widgets directly into the markup:
[Resizable](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxResizable/),
[ScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/),
[ValidationGroup](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxValidationGroup/).
For instance, we can set the content for
the [ScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/) widget as shown below:

```html
<dx-scroll-view>
    <div>Some scrollable content</div>
</dx-scroll-view>
```

### <a name="event-handling"></a>Event Handling ###
You can subscribe to DevExtreme Component Events via Vue [`v-on` directive](https://vuejs.org/v2/guide/events.html) (or `@` shorthand)

```html
<dx-text-box @focusIn="text = 'focused!'" />
```
The full list of a component events you can find in Events section of each DevExtreme widget API Reference (e.g. [TextBox events](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxTextBox/Events/)).

## <a name="type-checks"></a>Type Checks ##
DevExtreme Vue provides [Prop Validation and Type Checks](https://vuejs.org/v2/guide/components-props.html#Prop-Validation). That means each DevExtreme Vue Component specifies the types and acceptable values for its props. If such constraints are broken, Vue will produce a console warning (if using the development build).


## <a name="data-layer-and-utils"></a>DevExtreme Data Layer and Utils ##
The DevExtreme includes a [Data Layer](https://js.devexpress.com/Documentation/Guide/Data_Layer/Data_Layer/) and [Utils](https://js.devexpress.com/Documentation/ApiReference/Common/utils/) which can be helpfull in different scenarios.


## <a name="license"></a>License ##

**DevExtreme Vue components are released as a MIT-licensed (free and open-source) add-on to DevExtreme.**

Familiarize yourself with the [DevExtreme License](https://js.devexpress.com/Licensing/).

[A free trial is available!](http://js.devexpress.com/Buy/)

## <a name="support-feedback"></a>Support & Feedback ##
* For general Vue questions, check [Vue Guide](https://vuejs.org/v2/guide/)
* For questions regarding DevExtreme libraries and widgets' APIs, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)
