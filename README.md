<a name="module_browserify-configify"></a>
#browserify-configify
[![view on npm](http://img.shields.io/npm/v/browserify-configify.svg)](https://www.npmjs.org/package/browserify-configify)
[![npm module downloads per month](http://img.shields.io/npm/dm/configify.svg)](https://www.npmjs.org/package/browserify-configify)
[![Build Status](https://api.travis-ci.org/SC5/browserify-configify.svg?branch=master)](https://travis-ci.org/SC5/browserify-configify)
[![Dependency Status](https://david-dm.org/SC5/browserify-configify.svg)](https://david-dm.org/SC5/browserify-configify)

Configify substitutes the variables within JSON configurations with the
values found from environment (process.env) or against a specified
dictionary.

**Example**  

```js
var configify = require('browserify-configify');
```

**Members**

* [browserify-configify](#module_browserify-configify)
  * [configify.configify(file, cb)](#module_browserify-configify.configify)
  * [configify.configure(opts)](#module_browserify-configify.configure)

<a name="module_browserify-configify.configify"></a>
##configify.configify(file, cb)
The default configify transformation, passed to Browserify.

**Params**

- file `String` - The file to transform  
- cb `function` - The callback to execute after the transform  

**Returns**:  - The browserify transform  
**Example**  
```js
var configify = require('browserify-configify');
var b = browserify('app.js'));

b.transform(configify);
b.bundle(callback);
```

<a name="module_browserify-configify.configure"></a>
##configify.configure(opts)
Pass a configuration to configify. Returns a new instance of
configify, leaving the existing instance intact.

Currently the only option to configure is the dictionary to use
for value substitutions that overrides environment variables.

**Params**

- opts `Object` - The configuration object to pass.  

**Returns**: `function` - A new instance of configify, with the given options  
**Example**  
```js
var options = {
  dict: { HOME: '/home/configify' }
};
var configured = configify.configure(options);

b.transform(configured);
```

