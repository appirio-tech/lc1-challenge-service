#HTML Coding Guidelines

##General
- Use valid HTML where possible.
- Markup should be well-formed, semantically correct and generally valid.
- Do not close void elements
    ```
    eg. use
    <br>
      not
    <br />
    ```

###File names
- Hyphenated lowercase (spinal-case)
- File extension: .html

###Document Type
Use a html5 document type.

```html
<!DOCTYPE html>
```

##Type Attributes
Omit type attributes for style sheets and scripts. Do not use type attributes for style sheets (unless not using CSS) and scripts (unless not using Javascript).

Specifying type attributes in these contexts is not necessary as HTML5 implies text/css and text/javascript as defaults. This can be safely done even for older browsers.

```html
<!-- Not recommended -->
<link type="text/css" rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.2.2/css/bootstrap.min.css">

<!-- Recommended -->
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.2.2/css/bootstrap.min.css">
```

```html
<!-- Not recommended -->
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/angularjs/1.1.1/angular.min.js"></script>

<!-- Recommended -->
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.1.1/angular.min.js"></script>
```

##Protocol
Omit the protocol portion (http:, https:) from URLs pointing to images, stylesheets, scripts and other media files unless the respective files are not available over both protocols.

Omitting the protocol, prevents mixed content issues.

```html
<!-- Not recommended -->
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.1.1/angular.min.js"></script>

<!-- Recommended -->
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.1.1/angular.min.js"></script>
```

##Quotation Marks
When quoting attributes values, use double quotation marks ("") rather than single quotation marks ('') around attribute values.

```html
<!-- Not recommended -->
<a class='signin-button'>Sign in</a>

<!-- Recommended -->
<a class="signin-button">Sign in</a>
```

##Entity References
Do not use entity references.

```html
<!-- Not recommended -->
The currency symbol for the Euro is &ldquo;&eur;&rdquo;.

<!-- Recommended -->
The currency symbol for the Euro is “€”.
```

##Formatting

###Indentation
Indent with 2 spaces. Don’t use tabs or mix tabs and spaces for indentation.

```html
<ul>
  <li>Cool</li>
  <li>Mo</li>
  <li>Dee</li>
</ul>
```

###Capitalization
Use only lowercase. This applies to HTML element names, attributes, attribute values.

```html
<!-- Not recommended -->
<A HREF="/">Home</A>
```

```html
<!-- Recommended -->
<img src="appirio.png" alt="Appirio">
```

###Line breaks
Use a new line for every block, list, or table element, and indent every such child element. Independent of the styling of an element, put every block, list, or table element on a new line. Also, indent them if they are child elements of a block, list, or table element.

Note: If you run into issues around whitespace between list items it’s acceptable to put all li elements in one line. A linter is encouraged to throw a warning instead of an error.

Note: Extra line breaks are acceptable (and encouraged) between 'sections' to improve readability.

```html
<!-- User List -->
<ul>
  <li>Cool</li>
  <li>Mo</li>
  <li>Dee</li>
</ul>

<!-- Total Cost Table -->
<table>
  <thead>
    <tr>
      <th scope="col">Cost</th>
      <th scope="col">Total</th>
  <tbody>
    <tr>
      <td>$ 50.00</td>
      <td>$ 400.50</td>
    </tr>
  </tbody>
</table>
```

