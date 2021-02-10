# CSS Concept

## Use of styles via CSS

In principle, before each use of CSS should be considered whether the use in the planned place is absolutely necessary. Special caution with:

- **Changes of colors, font sizes and fonts:** Should be urgently avoided, since we always refer to the properties defined in the theme.
- **Add spacing (padding):** Should be urgently avoided, as AntD's Space component should be used for this.

### Basic rules:

- we do **just use inline CSS with AntD componentes for 1-2 properties** -> all CSS code with more than two properties is outsourced to external files.
- **global CSS properties** (which cannot be specified in the theme) are only written to `Index.css` to prevent several sources of global style
- **local CSS properties** are written to a file next to the component where they occur and CSS modules are used for this purpose
- if **multiple components** need the **same customization**, the CSS property should be set in a CSS modules file next to the common parent component

### CSS vs. CSS modules

In React the style of "normal" CSS files like _Example.css_ are defined globally. Therfore you don't need to explicitly import the CSS file to use the style. Thus be very careful when using normal CSS files and keep in mind that the style you define can be used in any file of the repository.
For example when you define the following style...

```css
.button {
  background-color: red;
}
```

... this might lead to confusion because whenever someone uses the class button now this style is applied no matter if it was intended or not.

If you want to apply style just to spefific files and not globally react has a solution called CSS modules. Instead of creating a file _Example.css_ you have to create _Example.module.css_. This file you have to explicitly import in every file you want to use it in. For example like this:

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

```
<button className={styles.button}></button>
```

### Conventions

- naming:
  For the naming of classes and ids please use **hyphens** consistently.
  For example don't call the class `buttonBackground` and instead call it `button-background`.
- sizing:
  Try to only use relative units (vw,vh,rem,%) to size elements and **not** absolut units (px)
- coloring:
  Try to only use the predefined css variables of our color schema when coloring a component/element.

---

## Corporate / Visual Identity

### Colors:

- color-primary: #00C2FF <span style="background-color:#00C2FF; color:#00C2FF">example</span>

- color-primary-inverted: #1C272B <span style="background-color:#1C272B; color:#1C272B">example</span>

- color-primary-inverted-2: #2F3C41 <span style="background-color:#2F3C41; color:#2F3C41">example</span>

- color-primary-inverted-text: #FFFFFF <span style="background-color:#FFFFFF; color:#FFFFFF; border-color:black; border-style:solid;">example</span>

- color-background: #EFEFEF <span style="background-color:#EFEFEF; color:#EFEFEF">example</span>

- color-background-2: #FFFFFF <span style="background-color:#FFFFFF; color:#FFFFFF; border-color:black; border-style:solid;">example</span>

- color-background-text: #1D1D1F <span style="background-color:#1D1D1F; color:#1D1D1F">example</span>

- color-cta: #FF6B00 <span style="background-color:#FF6B00; color:#FF6B00">example</span>

How to use this color schema:

- color-primary: Is the primary color of our brand. It is used for important elements (e.g headlines)
- color-primary-inverted: Is the main color complementing the primary color. For example it can be used for the header/footer.
- color-primary-inverted-2: Is the another color complementing the primary color. It is useful in combination with color-primary-inverted.
- color-primary-inverted-text: Is the color of all text written on color-primary-inverted or color-primary-inverted-2.
- color-background: Is the main background color of the website and should therefore be used for the coloring of the background.
- color-background-2: Is another background color that can be used on the main background color (e.g. for containers).
- color-background-text: The color of all the text that is either written on color-background or color-background-2
- color-cta: Is the "call-to-action" color and thus is used for elements like buttons.

### Font

Font-Settings:

- font-family: 'Lato', sans-serif;
- font-style: normal;
- font-display: swap;
- font-weight: 400;

Font-Size: 1rem

### Random

- Border-Radius: 5px
