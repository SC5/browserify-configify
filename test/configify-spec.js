var vows = require('vows'),
    assert = require('assert'),
    path = require('path'),
    vm = require('vm'),
    configify = require('..'),
    util = require('jsos-util'),
    browserify = require('browserify');

vows.describe('util.merge').addBatch({
  'When configififying a valid JSON file': {
    topic: function() {
      var b = browserify(path.join(__dirname, 'config.js'));

        b.transform(configify);
        b.bundle(this.callback);
    },
    
    'Variables get substituted': function(err, bundle) {
      function test(json) {
        assert.equal(process.env.HOME, json.foo.home);
      }

      vm.runInNewContext(bundle, {
        console: console,
        test: test
      });
    }
  },

  'When configifying an invalid JSON file': {
    topic: function() {
      var b = browserify(path.join(__dirname, 'invalid.js'));

        b.transform(configify);
        b.bundle(this.callback);
    },
    'Callback gets triggered with an error': function(err, bundle) {
      // Make sure we got a proper error that can be bubbled up
      assert.ifError(!err);
    }
  },

  'When configifying an nonexisting JSON': {
    topic: function() {
      var b = browserify(path.join(__dirname, 'nonexisting.js'));

        b.transform(configify);
        b.bundle(this.callback);
    },

    'Callback gets triggered with an error': function(err, bundle) {
      // Make sure we got a proper error that can be bubbled up
      assert.ifError(!err);
    }
  },

  'When specifying an external configuration': {
    topic: function() {
      var b = browserify(path.join(__dirname, 'config.js'));

        // Configify with a new instance with options
        b.transform(configify.configure({ dict: { HOME: '/home/configify' }}));
        b.bundle(this.callback);
    },

    'The external configuration is honored': function(err, bundle) {
      // The test that gets injected into the VM and run there.
      function test(json) {
        assert.equal('/home/configify', json.foo.home);
      }

      vm.runInNewContext(bundle, {
        console: console,
        test: test
      });
    }
  }
}).export(module); // Export the Suite