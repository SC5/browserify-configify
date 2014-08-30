/** 
 * [![view on npm](http://img.shields.io/npm/v/browserify-configify.svg)](https://www.npmjs.org/package/browserify-configify)
 * [![npm module downloads per month](http://img.shields.io/npm/dm/configify.svg)](https://www.npmjs.org/package/browserify-configify)
 * [![Build Status](https://api.travis-ci.org/SC5/browserify-configify.svg?branch=master)](https://travis-ci.org/SC5/browserify-configify)
 * [![Dependency Status](https://david-dm.org/SC5/browserify-configify.svg)](https://david-dm.org/SC5/browserify-configify)
 *
 * Configify substitutes the variables within JSON configurations with the
 * values found from environment (process.env) or against a specified
 * dictionary.
 *
 * @module browserify-configify
 * @alias configify
 * @example 
* ```js
 * var configify = require('browserify-configify');
 * ```
 */
var through = require('through2'),
    util = require('jsos-util');

// Default configuration
var defaults = {
  // The key-value dictionary to use, defaults to process.env
  dict: {}
};

function isJSON(file) {
  return (/\.json$/).test(file);
}

/**
 * The default configify transformation, passed to Browserify.
 *
 * @alias module:browserify-configify.configify
 * @example
 * ```js
 * var configify = require('browserify-configify');
 * var b = browserify('app.js'));
 *
 * b.transform(configify);
 * b.bundle(callback);
 * ```
 * @param {String} file The file to transform
 * @param {Function} cb The callback to execute after the transform
 * @return The browserify transform
 */
function configify(file, cb) {
  // Note: We rely on configify having a valid 'this' containing options
  var that = this,
      buffer = '';

  // Don't transform anything else than JSON
  if (!isJSON(file)) {
    return through();
  }

  function transform(chunk, encoding, callback) {
    // Handle the case of nonexisting chunk'
    if (!chunk) {
      buffer = chunk;
      return callback();
    }

    buffer += chunk.toString();
    callback();
  }

  function flush(callback) {
    // Perform the transformation
    var parsed,
        transformed,
        dictionary = util.merge(that.dict, process.env);

    try {
      parsed = JSON.parse(buffer.toString());
    }
    catch(e) {
      // Return with an error callback
      return callback(e);
    }

    transformed = util.mapNested(parsed, function(val) {
      return util.substitute(val, dictionary);
    });
    this.push(JSON.stringify(transformed));
    callback();
  }

  return through(transform, flush);
}

/**
 * Pass a configuration to configify. Returns a new instance of
 * configify, leaving the existing instance intact.
 *
 * Currently the only option to configure is the dictionary to use
 * for value substitutions that overrides environment variables.
 *
 * @alias module:browserify-configify.configure
 * @example
 * ```js
 * var options = {
 *   dict: { HOME: '/home/configify' }
 * };
 * var configured = configify.configure(options);
 *
 * b.transform(configured);
 * ```
 * @param {Object} opts The configuration object to pass.
 * @return {Function} A new instance of configify, with the given options
 */
function configure(opts) {
  // Rebind the configy for new options
  var options = util.merge(opts, defaults);

  return configify.bind(options);
}

// Wrap up the exports with proper 'this' for defaults
var wrapped = configify.bind(defaults);
wrapped.configure = configure;

exports = module.exports = wrapped;
