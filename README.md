# DevExtreme Vue UI and Visualization Components #

[![Run Status](https://api.shippable.com/projects/5ab4c6354a24a207009ec636/badge?branch=master)](https://app.shippable.com/github/DevExpress/devextreme-vue)

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) as [Vue Components](https://vuejs.org).


* [Getting started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Install DevExtreme](#installation)
  * [Use DevExtreme Components](#use-components)
  * [API Reference](#api-reference)
* [Component Configuration](#component-configuration)
  * [Set Component Option](#component-option)
  * [Two-way Binding](#two-way-binding)
  * [Forms](#forms)
  * [Custom templates](#custom-templates)
  * [Event Handling](#event-handling)
* [DevExtreme Data Layer and Utils](#data-layer-and-utils)
* [Components with Transcluded Content](#components-with-transcluded-content)
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

You can also use DevExtreme Vue Components inside [Single file component](https://vuejs.org/v2/guide/single-file-components.html):
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

Or with [jsx](https://vuejs.org/v2/guide/render-function.html) render function:
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
To specify a widget's option
(the [text](http://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxButton/Configuration/#text)
option of dxButton):

```html
<dx-button :text="Simple button" />
```

### <a name="two-way-binding"></a>Two-way Binding ###
You can set option with `sync` modifier to bind `bindingProperty` to widget option.

```html
<dx-text-box :value.sync="bindingProperty" />
```

###  <a name="forms"></a>Forms ###
The DevExtreme Vue editors support [v-model](https://vuejs.org/v2/guide/forms.html) directive which create two-way binding on the editor's [value](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxTextBox/Configuration/#value)

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

Note that in single file component, you can't use `<template>` tag for slot element. Use `<div>` instead:

```html
<template>
    <dx-list :items="items">
        <div slot="item" slot-scope="data">
            <i>This is my template for {{data}}</i>
        </div>
    </dx-list>
</template>
```


### <a name="event-handling"></a>Event Handling ###
You can also subscribe to DevExtreme Component Events() via Vue [`v-on` (or  short`@`) directive](https://vuejs.org/v2/guide/events.html)

```html
<dx-text-box @focusIn="text = 'focused!'" />
```
The full list of a component events you can find in [Events](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxTextBox/Events/) section of each DevExtreme widget API Reference.

## <a name="data-layer-and-utils"></a>DevExtreme Data Layer and Utils ##
The DevExtreme includes a [data layer]((https://js.devexpress.com/Documentation/Guide/Data_Layer/Data_Layer/)) and [utils](https://js.devexpress.com/Documentation/ApiReference/Common/utils/) which can be helpfull in different application parts.

## <a name="components-with-transcluded-content"></a>Components with Transcluded Content ##

In addition to using template, it is possible to put the content of the following widgets directly into the markup:
[dxResizable](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxResizable/),
[dxScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/),
[dxValidationGroup](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxValidationGroup/).
For instance, we can set the content for
the [dxScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/) widget as shown below:

```html
<dx-scroll-view>
    <div>Some scrollable content</div>
</dx-scroll-view>
```


## <a name="license"></a>License ##

**DevExtreme Vue components are released as a MIT-licensed (free and open-source) add-on to DevExtreme.**

Familiarize yourself with the [DevExtreme License](https://js.devexpress.com/Licensing/).

[A free trial is available!](http://js.devexpress.com/Buy/)

## <a name="support-feedback"></a>Support & Feedback ##
* For general Vue questions, check [Vue Guide](https://vuejs.org/v2/guide/)
* For questions regarding DevExtreme libraries and widgets' APIs, use [DevExpress Support Center](https://www.devexpress.com/Support/Center)
