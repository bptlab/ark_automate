# How to apply CSS in this Project

## Use of styles via CSS

In principle, before each use of CSS should be considered whether the use in the planned place is absolutely necessary. Special caution with:

- **Changes of colors, font sizes, and fonts:** Should be urgently avoided since we always refer to the properties defined in the theme.
- **Add spacing (padding):** Should be urgently avoided, as AntD's Space component should be used for this.

### Basic rules for styling:

 <details><summary>See the rules
 </summary><p>

- we do **just use inline CSS with AntD components for 1-2 properties** -> all CSS code with more than two properties is outsourced to external files.
- **global CSS properties** (which cannot be specified in the theme) are only written to `Index.css` to prevent several sources of global style
- **local CSS properties** are written to a file next to the component where they occur and CSS modules are used for this purpose
- if **multiple components** need the **same customization**, the CSS property should be set in a CSS modules file next to the common parent component

 </p></details>

### CSS vs. CSS modules

 <details><summary>When to use what?
 </summary><p>

In React the style of "normal" CSS files like _Example.css_ are defined globally. Therefore you don't need to explicitly import the CSS file to use the style. Thus be very careful when using normal CSS files and keep in mind that the style you define can be used in any file of the repository.
For example when you define the following style...

```css
.button {
  background-color: red;
}
```

... this might lead to confusion because whenever someone uses the class button now this style is applied no matter if it was intended or not.

If you want to apply style just to specific files and not globally react has a solution called CSS modules. Instead of creating a file _Example.css_ you have to create _Example.module.css_. This file you have to explicitly import in every file you want to use it in. For example like this:

```jsx
import styles from './Example.module.css';
```

Now let's continue with this example. Let's say in _Example.module.css_ we have defined the following because we just want the buttons of this file to be green:

```css
.button {
  background-color: green;
}
```

In the file we would include the style in the following way:

```jsx
<button className='{styles.button}'></button>
```

 </p></details>

### Conventions

 <details><summary>We agreed on
 </summary><p>

- naming:
  For the naming of classes and ids please use **hyphens** consistently.
  For example, don't call the class `buttonBackground` and instead call it `button-background`.
- sizing:
  Try to use only relative units (vw,vh,rem,%) to size elements and **not** absolut units (px)

 </p></details>
