# DevExtreme Vue UI and Visualization Components #

[![Build Status](https://img.shields.io/shippable/5444c5ecb904a4b21567b0ff/master.svg?maxAge=43200)](https://app.shippable.com/github/DevExpress/devextreme-vue)
[![NPM](https://img.shields.io/npm/v/devextreme-vue.svg?maxAge=43200)](https://www.npmjs.com/package/devextreme-vue)

### If you are looking for the v18.2 branch, please follow this link: [https://github.com/DevExpress/devextreme-vue/tree/18.2](https://github.com/DevExpress/devextreme-vue/tree/18.2).

This project allows you to use [DevExtreme](http://js.devexpress.com) [Vue](https://vuejs.org) Components.


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
  * [Configuration Components](#configuration-components)
    * [Basic usage](#configuration-components-basic)
    * [Collection Options](#configuration-components-collection)
  * [Getting a Widget Instance](#widget-instance)
* [Type Checks and TypeScript Support](#type-checks)
* [DevExtreme Data Layer and Utils](#data-layer-and-utils)
* [DevExtreme Validation](#validation)
* [License](#license)
* [Support & Feedback](#support-feedback)
* [Version history](#version-history)

## <a name="getting-started"></a>Getting Started ##
You can try this [live example](https://codesandbox.io/s/github/lukyanovas/devextreme-vue-example), [feature-based examples](https://js.devexpress.com/Demos/WidgetsGallery/Demo/Data_Grid/LocalDataSource/Vue/Light/) or configure local development environment as described below.

### <a name="prerequisites"></a>Prerequisites ###
[Node.js and npm](https://docs.npmjs.com/getting-started/installing-node) are required

### <a name="installation"></a>Install DevExtreme ###

Install the **devextreme** and **devextreme-vue** npm packages:

```console
npm install --save devextreme devextreme-vue
```
#### <a name="additional-configuration"></a>Additional Configuration ####

The further configuration steps depend on which build tool, bundler or module loader you are using:

* [Configuring Webpack](https://github.com/DevExpress/devextreme-vue/blob/master/docs/using-webpack.md)
* [Configuring Vue CLI](https://github.com/DevExpress/devextreme-vue/blob/master/docs/using-vue-cli.md)

### <a name="import_devextreme_modules"></a>Import DevExtreme Modules and Themes  ###

Import DevExtreme modules in a DevExtreme component's file.

```js
import DxButton from 'devextreme-vue/button';
```

DevExtreme themes can be imported only once in your application's main file:

```js
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';
```

See the [Predefined Themes](https://js.devexpress.com/Documentation/Guide/Themes/Predefined_Themes/#Themes_in_Sites) guide for more information on DevExtreme themes.


### <a name="use-components"></a>Use DevExtreme Components  ###

You can use DevExtreme components in a [single file component](https://vuejs.org/v2/guide/single-file-components.html),

```html
<template>
    <dx-button :text='text'/>
</template>

<script>
import DxButton from 'devextreme-vue/button';
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

... in a [jsx](https://vuejs.org/v2/guide/render-function.html#JSX) render function,

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

... or directly in a vue template.

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

The complete list of components and their APIs are described in the [DevExtreme API Reference](http://js.devexpress.com/Documentation/ApiReference/).

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

To specify a DevExtreme Vue Component template's markup, use a [named slot](https://vuejs.org/v2/guide/components-slots.html#Named-Slots). You should also specify a [slot scope](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to access the template element's data.

For instance, you can specify the itemTemplate:

```html
<div id="app">
    <dx-list :items="items">
        <div slot="item" slot-scope="{ data }">
            <i>This is my template for {{data}}</i>
        </div>
    </dx-list>
</div>
```

```js
import Vue from 'vue';
import DxList from 'devextreme-vue/list';

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

`item` is the default name of the dxList widget's item template. You can specify a custom name for the template and for your `slot`:

```html
<div id="app">
    <dx-list :items="items" item-template="my-template">
        <div slot="my-template" slot-scope="{ data }">
            <i>This is my template for {{data}}</i>
        </div>
    </dx-list>
</div>
```

### <a name="components-with-transcluded-content"></a>Components with Transcluded Content ##

The following widgets support putting a content directly to the widget's container:

- [Resizable](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxResizable/)  
- [ScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/)  
- [ValidationGroup](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxValidationGroup/)  

For example, you can specify the [ScrollView](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxScrollView/) widget's content as follows:

```html
<dx-scroll-view>
    <div>Some scrollable content</div>
</dx-scroll-view>
```

### <a name="event-handling"></a>Event Handling ###
You can subscribe to DevExtreme Component events using the Vue's [`v-on` directive](https://vuejs.org/v2/guide/events.html) (or `@` shorthand)

```html
<dx-text-box v-model="text" @focusIn="handleFocusIn" />
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
A widget instance is required to call methods. Pass a component key to the [`$refs` property](https://vuejs.org/v2/api/#vm-refs) property to get a component whose `instance` field stores the widget instance. The component's key is defined in the component's [`ref` attribute](https://vuejs.org/v2/api/#ref).

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

## <a name="type-checks"></a>Type Checks and TypeScript Support ##
You should specify proper values for the components' properties because DevExtreme Vue components use [Prop Validation and Type Checks](https://vuejs.org/v2/guide/components-props.html#Prop-Validation). Otherwise, Vue produces a console warning (if you are using the development build).

We also provide TypeScript declarations for DevExtreme Components. Strict typing allows you to catch many bugs and improve your workflow by adding features like auto-completion and automated refactoring.

[This](https://github.com/DevExpress/devextreme-examples/tree/18_1/webpack-vue-typescript) example demonstrates how to use DevExtreme Vue components with TypeScript.

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

## <a name="configuration-components"></a>Configuration Components ##

DevExtreme Vue Components provide configuration components for the underlying widget's complex nested options.

Use a named import to get a configuration component.
```js
import DxChart, { DxTooltip } from "devextreme-vue/chart"; 
```
You can use all data-bind features (such as `.sync` modifier) in your nested configuration components.

### <a name="configuration-components-basic"></a>Basic Usage ###
The following example demonstrates how to configure the dxChart widget's [tooltip](https://js.devexpress.com/Documentation/ApiReference/Data_Visualization_Widgets/dxChart/Configuration/tooltip/) option:

```html
<dx-chart
  :data-source="dataSource"
  title="Pizza Shop Complaints">
  <dx-tooltip :enabled="showTooltip"/>
</dx-chart>

<dx-button text="Toggle tooltip" @click="toggleTooltip"/>
```

```js
import DxChart, { DxTooltip } from "devextreme-vue/chart"; 
import DxButton from "devextreme-vue/button"; 

import { complaintsData } from './data.js';

export default {
  components: {
    DxChart,
    DxTooltip,
    DxButton
  },
  data() {
    return {
      dataSource: complaintsData,
      showTooltip: false
    };
  },
  methods: {
    toggleTooltip() {
      this.showTooltip = !this.showTooltip;
    }
  }
};
```

### <a name="configuration-components-collection"></a>Collection Options ###
You can also use configuration components for complex collection options.
The following example demonstrates how to configure the dxDataGrid widget's [columns](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/) option:

```html
<dx-data-grid :data-source="dataSource">
  <dx-column data-field="firstName"/>
  <dx-column data-field="lastName" caption="Last Name" :visible.sync="showLastName"/>
</dx-data-grid>

<dx-check-box text="Show the 'Last Name' column" v-model="showLastName"/>
```

```js
import DxDataGrid, { DxColumn } from "devextreme-vue/data-grid"; 
import DxCheckBox from "devextreme-vue/check-box"; 

import { data } from './data.js';

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxCheckBox
  },
  data() {
    return {
      dataSource: data,
      showLastName: true
    };
  }
};
```

Note that configuration components are not provided for options that accept a type that depends on another option's value. For example,
the DataGrid's [editorOptions](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxDataGrid/Configuration/columns/#editorOptions), Form's [editorOptions](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxForm/Item_Types/SimpleItem/#editorOptions), Toolbar's [widget](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxToolbar/Default_Item_Template/#options) options.


If a configuration component has the `template` option, you can put the default-scoped content directly into this component. The following example demonstrates how to specify a template for a dx-item component:

```html
<dx-list>
  <dx-item>
    <span slot-scope="_">orange</span>
  </dx-item>
  <dx-item>
    <span slot-scope="_">white</span>
  </dx-item>
  <dx-item>
    <span slot-scope="_">black</span>
  </dx-item>
</dx-list>
```

```js
import {
  DxList,
  DxItem
} from "devextreme-vue/list";

export default {
  components: {
    DxList,
    DxItem
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

## <a name="version-history"></a>Version history ###

| DevExtreme | Vue |
| ---------- | ----------------|
| v19.1.x <br/> v18.2.x | v2.6.3+ |
| v18.1.x | v2.5.16 - v2.6.0 |
