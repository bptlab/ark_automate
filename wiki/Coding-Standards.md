# Coding Standards

In this repository we enforce the following coding standards.

## Tools
### ESLint
In this project we use [EsLint](https://eslint.org/) as Linter and use the following configuration:

```json    
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "plugin:react/recommended",
    "airbnb",
    "prettier",
    "prettier/react"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["react", "only-warn"],
  "rules": {
    "no-console": ["error", { "allow": ["warn", "error"] }]
  },
  "root": true
}

```

[Here](https://eslint.org/docs/rules/) you can find the rules that eslint enforces.
### Prettier
Another Code Formatting Tool being used is [Prettier](https://prettier.io/). Here we use the following configuration:

```json
{
  "tabWidth": 2,
  "bracketSpacing": true,
  "endOfLine": "lf",
  "jsxSingleQuote": true,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "useTabs": false
}

```

[Here](https://prettier.io/docs/en/options.html) you can find all the rules that prettier enforces by default.

**These tools enforce a lot of formatting, code-quality and simplifications that give use a base layer of standards. Please install these in your IDE and configure them as stated above.**

## Coding Standards

### Naming
- Variable Names in `lowerCamelCase`
- use PascalCase for the naming of components (.jsx files)
- use camelCase for the naming of all other files (.js files mainly)
- use UPPERCASE for constants
- "Single Source of Truth" is abbreviated with `Ssot` or `ssot` (don't use `SSoT` or `SSOT`)
- use `Robot` in all cases instead of `Bot`
- use `Application` in all cases instead of `App` (in context of supported RPA Applications)
- use **hyphens** for CSS-classes and CSS-ids consistently
   - For example, don't call the class `buttonBackground` and instead call it `button-background`.

### General Code-Style
- Do not use double empty lines
- Space after openning bracket and before closing bracket (Goal: `import { Space } from AntD`)
- Always use single-quotation marks
- We use only arrow functions. Please do not use the `function` keyword.
- Try to use only relative units (vw,vh,rem,%) to size elements with css and **not** absolut units (px)

### Documentation
Please do not use inline comments to explain the idea behind a variable or a function. Only use those for sources where you found a special solution or workaround or for especially complex code snippets. Further comments regarding the documentation with JSDoc are also ok/appreciated.

Please document every written function for our automated documentation [JSDoc](https://jsdoc.app/). See our Guide for that [here](https://github.com/bptlab/ark_automate/wiki/How-to-write-code-documentation).


### Export/Imports

#### Frontend
We use 
```javascript 
import xyz from 'pathOrModule' // for imports
default export yourModule      // for exports
``` 
Here `export` statements are always the last statement of a component (If available, a proptype typechecking therefore has to be done before the export statement)
#### Backend
We use 
```javascript 
require('pathToFile')   // for imports
exports.yourFunction()  // for exports
```


### Other
- Try to avoid to fix Eslint warnings by adding the "fix-comment"
