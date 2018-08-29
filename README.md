# DevExtreme Vue UI and Visualization Components #

[![Build Status](https://img.shields.io/shippable/5444c5ecb904a4b21567b0ff/18.2.svg?maxAge=43200)](https://app.shippable.com/github/DevExpress/devextreme-vue)
![Project Status](https://img.shields.io/badge/Project%20Status-alpha-orange.svg?maxAge=43200)
[![NPM](https://img.shields.io/npm/v/devextreme-vue.svg?maxAge=43200)](https://www.npmjs.com/package/devextreme-vue)

This project allows you to use [DevExtreme Widgets](http://js.devexpress.com/Demos/WidgetsGallery/) as [Vue](https://vuejs.org) Components.


* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Install DevExtreme](#installation)
  * [Use DevExtreme Components](#use-components)
* [API Reference](#api-reference)
* [Component Configuration](#component-configuration)
  * [Set Component Option](#component-option)
  * [Two-way Binding](#two-way-binding)
  * [Editors Value Binding](#editors-value-binding)
  * [Custom Templates](#custom-templates)
  * [Components with Transcluded Content](#components-with-transcluded-content)
  * [Event Handling](#event-handling)
  * [Getting a Widget Instance](#widget-instance)
* [Type Checks](#type-checks)
* [DevExtreme Data Layer and Utils](#data-layer-and-utils)
* [DevExtreme Validation](#validation)
* [License](#license)
* [Support & Feedback](#support-feedback)
## <a name="getting-started"></a>Getting Started ##
You can try this [live example](https://codesandbox.io/s/github/lukyanovas/devextreme-vue-example) (no need to install anything).

See the sections below if you prefer using a local development environment.
### <a name="prerequisites"></a>Prerequisites ###
[Node.js and npm](https://docs.npmjs.com/getting-started/installing-node) are required

### <a name="installation"></a>Install DevExtreme ###

Install the **devextreme** and **devextreme-vue** npm packages:

```console
npm install --save devextreme@18.2 devextreme-vue@18.2-unstable
```
#### <a name="additional-configuration"></a>Additional Configuration ####

The further configuration steps depend on which build tool, bundler or module loader you are using. Please choose the one you need:

* [Configuring Webpack](https://github.com/DevExpress/devextreme-vue/blob/master/docs/using-webpack.md)
* [Configuring Vue CLI](https://github.com/DevExpress/devextreme-vue/blob/master/docs/using-vue-cli.md)

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

You can use DevExtreme components in a [single file component](https://vuejs.org/v2/guide/single-file-components.html)...

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

```js
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

DevExtreme Vue components are similar to the [DevExtreme JavaScript API](http://js.devexpress.com/Documentation/ApiReference/) but use Vue syntax for specifying widget options, subscribing to events and custom template declaration.

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

### <a name="custom-templates"></a>Custom Templates ###
You can customize widget elements' appearance via the corresponding template properties. 

To specify a DevExtreme Vue Component template, use a [named slot](https://vuejs.org/v2/guide/components-slots.html#Named-Slots) to specify a template's markup. You also should specify a [slot scope](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to access the template element's data.

For instance, you can specify the itemTemplate:

```html
<div id="app">
    <dx-list :items="items">
        <div slot="item" slot-scope="data">
            <i>This is my template for {{data}}</i>
        </div>
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
    <dx-list :items="items" item-template="my-template">
        <div slot="my-template" slot-scope="data">
            <i>This is my template for {{data}}</i>
        </div>
    </dx-list>
</div>
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

### <a name="widget-instance"></a>Getting a Widget Instance ###
A widget instance is used when calling a widget method. You can get it in the following way:
1. Assign a unique key to the component's [`ref` attribute](https://vuejs.org/v2/api/#ref).
1. Use this key to retrieve the component from the [`$refs` property](https://vuejs.org/v2/api/#vm-refs).
1. Use the component's `instance` property to get the widget instance.

```html
<template>
    <div title="Accessing Widget Instance">
        <dx-text-box :ref="textBoxRefName"/>
        <br/>
        <dx-button text="Set focus" @click="setFocus"/>
    </div>
</template>

<script>
import { DxButton, DxTextBox } from "devextreme-vue";

const textBoxRefName = "some-ref-name";

export default {
  data: function() {
    return {
      textBoxRefName
    };
  },

  components: {
    DxTextBox,
    DxButton
  },

  methods: {
    setFocus: function() {
      this.textBox.focus();
    }
  },

  computed: {
    textBox: function() {
      return this.$refs[textBoxRefName].instance;
    }
  }
};
</script>
```

## <a name="type-checks"></a>Type Checks ##
You should specify proper values for the components' properties because DevExtreme Vue components use [Prop Validation and Type Checks](https://vuejs.org/v2/guide/components-props.html#Prop-Validation). Otherwise, Vue produces a console warning (if you are using the development build).

## <a name="data-layer-and-utils"></a>DevExtreme Data Layer and Utils ##
The DevExtreme includes a [Data Layer](https://js.devexpress.com/Documentation/Guide/Data_Layer/Data_Layer/) and [Utils](https://js.devexpress.com/Documentation/ApiReference/Common/utils/) that can be helpful in different scenarios.

## <a name="validation"></a>DevExtreme Validation ##
DevExtreme Vue editors support built-in [data validation](https://js.devexpress.com/Documentation/Guide/Widgets/Common/UI_Widgets/Data_Validation/).

```html
<dx-validation-group>
  <dx-text-box value="email@mail.com">
    <dx-validator :validationRules="validationRules.email" />
  </dx-text-box>
  <dx-text-box value="password">
    <dx-validator :validationRules="validationRules.password" />
  </dx-text-box>
  <dx-validation-summary />
  <dx-button text="Submit" @click="validate"/>
</dx-validation-group>
```
```js
import { DxButton, DxTextBox, DxValidator, DxValidationGroup, DxValidationSummary } from "devextreme-vue";

export default {
  components: {
    DxButton,
    DxTextBox, 
    DxValidator,
    DxValidationGroup,
    DxValidationSummary
  },
  methods: {
    validate(params) {
      const result = params.validationGroup.validate();
      if (result.isValid) {
          // form data is valid
          //params.validationGroup.reset();
      }     
    }
  },
  data: function() {
    return {
      validationRules: {
        email: [
            { type: "required", message: "Email is required." },
            { type: "email", message: "Email is invalid." }
        ],
        password: [
            { type: "required", message: "Password is required." }
        ]
    }};
  }
};
```
## <a name="license"></a>License ##

**DevExtreme Vue components are released as an MIT-licensed (free and open-source) DevExtreme add-on.**

See the [DevExtreme License](https://js.devexpress.com/Licensing/) for more information.

[A free trial is available](http://js.devexpress.com/Buy/)

## <a name="support-feedback"></a>Support & Feedback ##
* Check the [Vue Guide](https://vuejs.org/v2/guide/) for general Vue questions
* For questions regarding DevExtreme libraries and widgets' APIs, use the [DevExpress Support Center](https://www.devexpress.com/Support/Center)
