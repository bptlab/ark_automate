# Introduction in CSS
## CSS general info
- CSS = Cascading Style Sheets
- Only purpose is to style and animate markup language (HTML)
- Because we are rendering our React app in `HTML`, we can therefore also style all components of the app


## Getting started with CSS
<details><summary>How to use CSS
</summary><p>

**1. Use Inline CSS**
Just add `style` as another Attribute in the `HTML`-Tag. Add multiple styles with a semicolon. 
```html
<body style="background-color: blue;">
```

**2. Use Internal CSS**
In the <head></head> tag open a \<style> \</style> tag. There you can specifiy the html component affected and the styling that should be applied to it. For example:

```html
<head>
    <style>
        body {
            background-color: blue;
            }
    </style>
</head>
```
**3. Use External CSS**
Create a `styles.css` file and copy everything from your internal style tag to there. Then reference the file in the head of the html using the link tag. Then everywhere where you reference the style.css file, the styles will be applied.
`<link rel="stylesheet" href="./styles.css">`

Remember: Every HTML tag has already a default style, that may hide your additional styling. See here for more https://www.w3schools.com/cssref/css_default_values.asp

### How to debug CSS
Use the dev tools of your browser and check out the Style tab regarding your selected object.
![](https://i.imgur.com/OkpU7fx.png)

</p></details>

<details><summary>Anatomy of CSS Syntax
</summary><p>


```html
selector { 
    property: value; 
}

// Example
h1 { 
    color: red;
}
```
**Selector:** Who do you want to change?
**Property:** What do you want to change?
**Value:** How do you want it to be changed? 

### About CSS Selectors

**Which properties can I change?**
Checkout https://developer.mozilla.org/en-US/docs/Web/CSS/Reference#index


#### Selector: CSS Classes  
You can add `class` attributes to html tags which you can then select in your css and style. To target a class in your css file you need to put a `.` in front of your class identifier. You can state multiple classes inside the class html tag.
**Html**
```html
 <h1 class="title name"> Helloo
```

**CSS**
```
.title {
    color: red;
}
```


#### Selector: HTML IDs. 
You can add `id` attributes to html tags which you can then select in your css and style. To target a class you need to put a `#` in front of your class. You can only have a single instance of your id in your page (classes for multiple times). An html can have only one id.
**Html**
```html
<h1 id="MyTitle"> Helloo
```

**CSS**
```
#MyTitle {
    color: red;
}
```


#### Selector: Pseudo classes  
Some css selectors have `:` written in front of them. These styles are applied, when the affected html element is in a certain state, f.e. the mouse hovers above it. See for example [:hover](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover) 
```html
h1:hover{
    color= blue;
}
```


#### CSS Rule priority  
Id > class > Inline CSS tags > Internal CSS tags > External CSS tags > Predefined CSS values

</p></details>

<details><summary>Best practices
</summary><p>

- Write CSS Rules like this, starting the properties in a new line
```html
h1 {
    color: red;
    font-size : 200px;
}
```
- Alphabetically sort the selectors
- Use rem as font size unit
</p></details>

## Using CSS in React
<details><summary>Styling Options
</summary><p>

### Inline Styling  

To style an element with the inline style attribute, the value must be a JavaScript object. Properties with two names, like `background-color`, must be written with camel case syntax.
```jsx
class MyHeader extends React.Component {
  render() {
    return (
      <div>
      <h1 style={{color: "red"}}>Hello Style!</h1>
      <p>Add a little style!</p>
      </div>
    );
  }
}
```
> Inline CSS should only be used when 1-2 styles are given to a component, which are definitely not needed in any other context (e.g.) in another component. In this case, the styles do not have to be swapped out separately.

### Using external stylesheets  
Write your CSS styling in a separate .css file and import it.
**./App.jsx**
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class MyHeader extends React.Component {
  render() {
    <button class = LogInButton />
  }
}

ReactDOM.render(<MyHeader />, document.getElementById('root'));

```
**./App.css**
```jsx
button {
    color: red;
    margin: 10px;
}
```
### Dynamicaly changing Styles  
You can change your inline styles like any other variable (asuming that you have it as a JS object in your file). When the component is rendered, the values will be read and the styling then applied. Everytime you rerender, the values will be read again and with it any changes you applied.


```jsx
import React from 'react';
import ReactDOM from 'react-dom';

class MyPersons extends React.Component {
  this.state = {...}
  render() {
    const style = {
        backgroundColor: 'green',
        textColor: 'white'
    };
    
    if (this.state.isPersonVisible) {
        persons = ...
        style.backgroundColor = 'red'
    }
        
    return (
         {persons}
         <button style = {style} />
        );
  }
}

ReactDOM.render(<MyPersons />, document.getElementById('root'));
```
Same can be done with classNames
`<p className={classes}> This is really working! <p/>`

</p>
</details>

## How to use AntD?
<details><summary>Basics about AntD
</summary><p>


To **use AntD**, it must be installed in the client directory. This is done automatically in our project via `package.json`. In each class where you want to use AntD, they must be imported individually. Nothing has to be changed in the possibly referenced CSS files.

Basically every HTML-Component is wrapped by an AntD-Component. You can identify AntD components by the fact that they are always capitalized compared to HTML components. `<button> plain HTML-Button </button>` vs. `<Button> AntD-Button </Button>`  

Therefore, whenever we add new frontend components, we use AntD components. So (with the exception of divs and other standard HTML tags) we should no longer use lowercase HTML tags in our code.

```jsx
import React from 'react';
import { Button } from 'antd';

const TestButton = () => (
  <>
    <Button>My AntD-Button</Button>
  </>
);

export default TestButton;
```

</p></details>

<details><summary>AntD-Components
</summary><p>

**Frequently used Components**  
- for button see: [Button](https://ant.design/components/button/)
- for normal text & headings see: [Typography](https://ant.design/components/typography/)
- for input fields see: [Input](https://ant.design/components/input/)

**About AntD Layout & Grid**  
**AntD Layout** gives us the possibility to set a layout for the page. A layout describes the arrangement of different blocks like header, footer, menu and content with various presets. We have used such a layout for all our pages that already appear in the final design with the navigation bar.
For design inspiration, we recommend taking a look at the [layout documentation](https://ant.design/components/layout/).

**AntD Grid**  
- As known from HTML, a page is created by lining up elements in rows. In these lines, columns can be used to divide the page horizontally.
- Your content elements should be placed directly in the col, and only col should be placed directly in row.
- The column grid system is a value of 1-24 to represent its range spans. For example, three columns of equal width can be created by `<Col span={8} />`.
- If the sum of col spans in a row are more than 24, then the overflowing col as a whole will start a new line arrangement.
- You can align Elements in the Grid horizontally and vertically and add Gutter (kind of margin between the boxes) which should always be preferred to the traditional alignment using CSS!

```jsx
import { Row, Col } from 'antd';

ReactDOM.render(
  <>
    <Row>
      <Col span={12}>col1</Col>
      <Col span={12}>col2</Col>
    </Row>
    <Row>
      <Col span={8}>col1</Col>
      <Col span={8}>col2</Col>
      <Col span={8}>col3</Col>
    </Row>
  </>,
  mountNode,
);
```
> This will return two rows. The first row contains two columns, the second row contains three columns.
> 
**AntD Space**  
If you arrange several elements together in a container, you should use `space` between the elements. Space is also an AntD component that includes all the components that should be aligned with each other with horizontal and vertical spacing.

```jsx
import { Button, Space } from 'antd';

function SpaceDemo() {
  return (
    <Space>
      <Button type="primary">Button 1</Button>
      <Button type="primary">Button 2</Button>
    </Space>
  );
}

ReactDOM.render(<SpaceDemo />, mountNode);
```
> This will return two Buttons, horizontally aligned with space between the buttons.
> 
By default `space` adds a distance in the horizontal and in the vertical. This can be specified with the `direction="vertical"` or `direction="horizontal"` attribute.

The size of the distance between the components can be changed with the size attribute (`size="small", size = "medium", size="large"`). It is also possible to specify the size of the space numerically. However, this is not recommended.

```jsx
import { Button, Space } from 'antd';

function SpaceDemo() {
  return (
    <Space size="small" direction="vertical">
      <Button type="primary">Button 1</Button>
      <Button type="primary">Button 2</Button>
    </Space>
  );
}

ReactDOM.render(<SpaceDemo />, mountNode);
```
> This will return two Buttons which have small spaces exclusively in the horizontal. Vertically, they have no spacing at all.
> 


**Link to the Documentation**. 
For a Overview of all AntD-Components expecially the huge amount of input and display components see the [Components-Documentation](https://ant.design/components/overview/) with many code-examples.

</p></details>

##



## Homework (take approx. 1h)  
1. If you are not familiar with CSS watch [this video](https://www.youtube.com/watch?v=0afZj1G0BIE). (for beginners)
3. Click through [this tutorial](https://de.learnlayout.com)
4. For fun with the CSS Grid first read [this](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) and then play [this](https://cssgridgarden.com/#de)
5. For fun with the CSS flexbox first read [this](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox) and then play [this](http://flexboxfroggy.com/)

## Further Reading. 
For more games to learn css checkout https://codepip.com/games/  
Take a look at this website https://css-tricks.com/  
For the styleguide issue https://24ways.org/2011/front-end-style-guides  