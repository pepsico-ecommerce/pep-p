# pep-p
Paragraph elements that support multiline text that will truncate with an ellipsis when the text overflows the parent element.
Adds a tooltip attribute on the element with the original non-truncated text.




### Examples:
```
<pep-p>Some text content that will be truncated to fit the parent element without overflowing.</pep-p>

<pep-p>
  Just like regular paragraphs, you can use <b>Phrasing Content</b> elements inside.
  See a list of Phrasing Content elements on <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Phrasing_content">mdn</a>
</pep-p>
```


## Install with NPM
Install directly from the PepsiCo github repo.
```
npm install --save git+https://github.com/pepsico-ecommerce/pep-p.git
```


## How to Use
Import/Include  the pep-p once into your project.
```
import 'pep-p';
```

###Note:
You only need to include `import 'pep-p';` once in your project. It registers the Custom Element allowing the browser to understand the `<pep-p></pep-p>` tag.
