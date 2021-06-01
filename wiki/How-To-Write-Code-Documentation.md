## General

We are using [JsDoc](https://jsdoc.app) with an [additional plugin](https://github.com/SoftwareBrothers/better-docs), which allows us to also tag components in React.

Documentation will be generated as a website under which the individual parts of the software (server/frontend) are visible and listed with their respective classes and modules.
It should be noted here, that although components are supported as a separate tag, they are in the current version still listed under the _Classes_ part of the documentation.

## How to write documentation

### React Components

As mentioned above, React components are supported through a plugin and are currently then still listed under the Classes section.
For components please try to use the following style (taken from the [plugins repo](https://github.com/SoftwareBrothers/better-docs#preview)):

```
/**
 * @description Some documented component
 * @category Frontend/Server
 * @component
 * @example
 * const text = 'some example text'
 * return ( <Documented text={text} /> )
 */
```

The attributes are:

- description: Describe the component, its use case and/or where it could be used
- category: Either _Frontend_ or _Server_, based on where it is used (for React components this should most likely always be _Frontend_)
- component: Tag to specify this as a component
- example: Code which describes a possible use scenario for this component

### Classes

To document classes, please follow the following scheme in front of the constructor method:

```
/**
 * @description This is a description of the MyClass constructor function.
 * @category Frontend/Server
 * @class
 * @classdesc This is a description of the MyClass class.
 */
```

The attributes are:

- description: Describe the constructor function
- category: Either _Frontend_ or _Server_, based on where it is used
- class: Tag to specify this as a class constructor
- classdesc: Describe the functionality and behavior of the class

### Functions/Methods

When grouping related functions loosely in a file because of the same context, please use the following snippet at the very beginning of the file to group all functions to that same module. For classes and components, this is done automatically and therefore a specification of the module is not needed there

```
/**
 * @description This is the description of what the function does
 * @param {string} arg1 - A nice argument
 * @param {*} arg2 - A fancy second argument
 * @returns {number} number of interest which is returned
 */
```

The attributes are:

- description: Describe the functionality and/or behavior of the function/method
- param {datatype}: Specify the different input parameters this function/method accepts by using multiple of these tags. Specify the datatype expected or specify that any input is allowed by using \*. Specify the name of the parameter and separated from that name specify what this parameter should represent.
- returns {datatype}: Specify the datatype returned by the function and what that value represents

#### Group as module

When grouping related functions loosely in a file because of the same context, please use the following snippet at the very beginning of the file to group all functions to that same module. For classes and components, this is done automatically and therefore a specification of the module is not needed there

```
/**
 * @category Frontend/Server
 * @module optionalString
 */
```

The attributes are:

- category: Either _Frontend_ or _Server_, based on where it is used
- module: Specify this file as a module. In the documentation, this module will receive the name of the relative filePath to the root or the specified (but optional) String passed in as a name.
