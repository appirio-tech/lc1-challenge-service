#CSS Coding Guidelines

##CSS Formatting Rules

###File names
- Hyphenated lowercase (spinal-case)
- File extension: .css

//Ruleset, Selector (group of selectors), Declaration, Property, Value, at-rules, comments

###Comments
Single line vs. Multi-line

###Block Content Indentation
Indent all block content, that is rules within rules as well as declarations, so to reflect hierarchy and improve understanding. 

Indent with 2 spaces. Don’t use tabs or mix tabs and spaces for indentation.

```css
@media screen, projection {

  html {
    background: #fff;
    color: #444;
  }
}
```

###Declaration Block Separation
Use a space between the last selector and the declaration block.
Always use a single space between the last selector and the opening brace that begins the declaration block.

The opening brace should be on the same line as the last selector in a given rule.

```css
/* Not recommended: missing space before brace */
#tc-header{
  margin-top: 1em;
}

/* Not recommended: unnecessary line break */
#tc-header
{
  margin-top: 1em;
}

/* Recommended */
#tc-header {
  margin-top: 1em;
}
```

###Declaration Order
Alphabetize declarations.
Put declarations in alphabetical order in order to achieve consistent code in a way that is easy to remember and maintain.

Put vendor-specific prefixes at the end. 

```css
background: fuchsia;
border: 1px solid;
border-radius: 4px;
color: black;
text-align: center;
text-indent: 2em;
-moz-border-radius: 4px;
-webkit-border-radius: 4px;
```

###Declaration Stops
Use a semicolon after every declaration.
End every declaration with a semicolon for consistency and extensibility reasons.

```css
/* Not recommended */
.test {
  display: block;
  height: 100px
}

/* Recommended */
.test {
  display: block;
  height: 100px;
}
```

###Property Name Stops
Use a space after a property name’s colon.
Always use a single space between property and value (but no space between property and colon) for consistency reasons.

```css
/* Not recommended */
h3 {
  font-weight:bold;
}

/* Recommended */
h3 {
  font-weight: bold;
}
```

###Rule Separation
Separate rules by a single newline.
Always put a blank line (two line breaks) between rules.

```css
/* Not recommended */
html {
  background: #fff;
}
body {
  margin: auto;
  width: 50%;
}

/* Not recommended */
html {
  background: #fff;
}



body {
  margin: auto;
  width: 50%;
}

/* Recommended */
html {
  background: #fff;
}

body {
  margin: auto;
  width: 50%;
}
```

###CSS Quotation Marks
Use single quotation marks for attribute selectors and property values.
Use single (') rather than double (") quotation marks for attribute selectors or property values. Do not use quotation marks in URI values (url()).

Exception: If you do need to use the @charset rule, use double quotation marks—single quotation marks are not permitted.

```css
/* Not recommended */
@import url("//www.appirio.com/css/appirio.css");

html {
  font-family: "open sans", arial, sans-serif;
}

/* Recommended */
@import url(//www.appirio.com/css/appirio.css);

html {
  font-family: 'open sans', arial, sans-serif;
}
```

###Section Comments
Group sections by a section comment (optional).
If possible, group style sheet sections together by using comments. Separate sections with new lines.

```css
/* Header */
#tc-header {}

/* Footer */
#tc-footer {}

```

###Protocol
```css
/* Not recommended */
.example {
  background: url(http://www.appirio.com/images/example);
}

/* Recommended */
.example {
  background: url(//www.appirio.com/images/example);
}

```

###Shorthand Properties
Use shorthand properties where possible.
CSS offers a variety of shorthand properties (like font) that should be used whenever possible, even in cases where only one value is explicitly set.

Using shorthand properties is useful for code efficiency and understandability.
```css
/* Not recommended */
border-top-style: none;

/* Recommended */
border-top: 0;
```

```css
/* Not recommended */
font-family: palatino, georgia, serif;
font-size: 100%;
line-height: 1.6;

/* Recommended */
font: 100%/1.6 palatino, georgia, serif;
```

```css
/* Not recommended */
padding-bottom: 2em;
padding-left: 1em;
padding-right: 1em;
padding-top: 0;

/* Recommended */
padding: 0 1em 2em;
```

###0 and Units
Omit leading “0”s in values.
Do not use put 0s in front of values or lengths between -1 and 1.

```css
/* Not recommended */
font-size: 0.8em;

/* Recommended */
font-size: .8em;
```

###Hexadecimal Notation
Use 3 character hexadecimal notation where possible.
For color values that permit it, 3 character hexadecimal notation is shorter and more succinct.

```css
/* Not recommended */
color: #eebbcc;

/* Recommended */
color: #ebc;

```

###ID and Class Name Delimiters
Separate words in ID and class names by a hyphen (spinal case).
Do not concatenate words and abbreviations in selectors by any characters (including none at all) other than hyphens, in order to improve understanding and scannability.

```css
/* Not recommended: does not separate the words “demo” and “image” */
.demoimage {}

/* Recommended */
.demo-image {}
```

```css
/* Not recommended: uses underscore instead of hyphen */
.error_status {}

/* Recommended */
.error-status {}
```