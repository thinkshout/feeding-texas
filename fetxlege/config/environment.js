/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'fetxlege',
    environment: environment,
    baseURL: '/fetxlege/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.contentSecurityPolicy = {
      // Style sheets
      'style-src': "'self' 'unsafe-inline'",
      'style-src': "'self' 'unsafe-inline' feedingtexas.org",
      // API connections
      'connect-src': "'self' maps.googleapis.com openstates.org sunglightfoundation.com",
      'script-src': "'self' cdnjs.org",
      // Google Fonts
      'font-src': "'self' data: fonts.gstatic.com",
      'style-src': "'self' 'unsafe-inline' fonts.googleapis.com",
      'img-src': "'self' feedingtexas.org"
    }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.baseURL = '/get-involved/advocate';
  }

  console.log(ENV);

  return ENV;
};
