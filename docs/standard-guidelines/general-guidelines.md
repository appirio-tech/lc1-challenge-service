#General Guidelines

##File and Directory names
- Hyphenated lowercase (spinal-case)

###Exceptions
- node modules directory: snakecase (eg. node_modules)
- bower components directory: snakecase (eg. bower_components)
- license files: all upper case (eg. LICENSE)
- readme files: all upper case (eg. README.md)

## File Extensions
- js: javascript files
- css: css files
- html: templates, partials, etc. //do not use .tpl or .tpl.html
- md: markdown files
- json: json files
- png: images //png is preferred, but other image formats are OK

## Directory Structure
- `.gitignore`
- `LICENSE`
- `README.md`
- `Procfile` //if on Heroku
- `web.js` //if on Heroku
- `package.json` //if using Node
- `/.gitignore`
- `/docs`
  - `/standard-guidelines` //our standard guidelines (coding, style) across all repos
  - `/custom-guidelines` //guidelines for a specific repo
  - `/challenge-guidelines` //custom guidelines specific for a challenge
- `/node_modules` //dependent node modules
- `/client`
  - `/manage-challenge` //top level directory for a page. 'manage-challenge' is an example
  - `index.html` //top level page. always index.html
  - `bower.json` //optional. specify 3rd party client side dependencies
  - `/bower_components` //present if using bower.json. standard bower directory for 3rd party dependencies
  - `/css` //page specific css
  - `/data` //local data files. typically json data, but doesn't have to be
  - `/img` //non-agent specific images should be directly under /img
    - `/desktop` //desktop specific images
    - `/mobile` //mobile specific images
    - `/tablet` //tablet specific images
  - `/js`
    - `app.js` //module definition and primary app entry point. always app.js
    - `/controllers` //separate file for each angular controller. sub-directories allowed if needed
    - `/directives` //separate file for each angular directive. sub-directories allowed if needed
    - `/services` //separate file for each angular services. sub-directories allowed if needed
    - `/templates`  //separate file for each angular html template. sub-directories allowed if needed
- `/server`
 - // TODO