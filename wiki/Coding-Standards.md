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
- "Single Source of Truth" is abbreviated with `Ssot` or `ssot` (don't use `SSoT` or `SSOT`)
- use `Robot` in all cases instead of `Bot`
- use `Application` in all cases instead of `App` (in context of supported RPA Applications)


### General Code-Style
- Do not use double empty lines
- Space after openning bracket and before closing bracket (Goal: `import { Space } from AntD`)
- Always use single-quotation marks
- We use arrow functions only in the frontend. Please do not use the `function` keyword.

### Documentation
Please do not use inline comments to explain the idea behind a variable or a function. Only use those for Sources where you found a special solution or woraround or for especially complex code snippets.

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
- Do not fix Eslint warnings by adding the "fix-comment"
