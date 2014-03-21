var _ = require('underscore')
  , async = require('async')
  , extend = require('extend')
  , request = require('request')
  , cheerio = require('cheerio')
;

module.exports = function(options) {

  var self = this;
  this.options = extend({
    user: false,
    pass: false
  }, options)

  if(!this.options.user || !this.options.pass)
    throw new Error('google-alerts requires at a user & pass for your google account');

  var alertValueMap = {
    type: {
      'everything': 7, 'news': 1, 'blogs': 4, 'video': 9, 'discussions': 9, 'books': 22
    },
    interval: {
      'realtime': 0, 'daily': 1, 'weekly': 6
    },
    criteria: {
      'best': 0, 'all': 1
    }
  };

  this.create = function(params, cb) {

    var query;

    if(typeof params.query === 'string')
      query = params.query;

    if(typeof params === 'string')
      query = params, params = {};

    if(!query || !query.length) {
      if(typeof cb === 'function') return cb(new Error('google-alerts#create() requires at minimum the alert query - see readme'));
      else throw new Error('google-alerts#create() requires at minimum the alert query - see readme')
    }

    var httpDefaults = {
      followRedirect: true,
      followAllRedirects: true,
      strictSSL: false,
      jar: true
    };

    var alertParams = {
      q: query,
      t: alertValueMap.type[params.type] || 7,
      f: alertValueMap.interval[params.interval] || 1,
      l: alertValueMap.criteria[params.criteria] || 0,
      e: params.delivery || 'feed'
    };

    async.waterfall([
      function parseLogin(done) {

        var p = extend(httpDefaults, {
          uri: 'https://accounts.google.com/ServiceLogin?hl=en&service=alerts&continue=http://www.google.com/alerts/manage'
        });
        request.get(p, done)

      },
      function extractLoginFields(res, body, done) {

        var form = {};
        var $ = cheerio.load(body);
        var inputs = $('form').find('input');

        inputs.each(function(i, el) {
          form[$(this).attr('name')] = $(this).attr('value');
        });

        form['Email'] = self.options.user;
        form['Passwd'] = self.options.pass;

        done(null, form);

      },
      function doLogin(form, done) {

        var p = extend(httpDefaults, {
          uri: 'https://accounts.google.com/ServiceLoginAuth',
          form: form
        });
        request.post(p, done);

      },
      function parseCreate(res, body, done) {

        var p = extend(httpDefaults, {
          uri: 'http://www.google.com/alerts'
        });
        request.get(p, done);

      },
      function extractCreateInputs(res, body, done) {

        var $ = cheerio.load(body);
        var inputs = $('form').find('input');

        var form = {};
        inputs.each(function(i, el) {
          if($(this).attr('name')) form[$(this).attr('name')] = $(this).attr('value');
        });

        done(null, form);

      },
      function doCreate(form, done) {

        var p = extend(httpDefaults, {
          uri: 'http://www.google.com/alerts/create',
          form: extend(form, alertParams)
        });

        request.post(p, function(req, body) {
          done(null, p);
        });

      },

      function getFeedLink(sent, done) {

        if(typeof sent.form.e !== 'undefined' && sent.form.e !== 'feed')
          return done(null, params.delivery);

        var p = extend(httpDefaults, {
          uri: 'http://www.google.com/alerts/manage'
        });

        request.get(p, function(err, res, body) {
          var $ = cheerio.load(body);
          var feed = 'No Feed Found';

          $('form').find('td.alert-type a').each(function(i, el) {
            if( $(this).html() === sent.form.q )
              feed = $(this).closest('tr').find('.alert-delivery a').attr('href')
          });

          done(null, feed);
        });

      }
    ],
    function finished(err, feed) {
      if(typeof cb === 'function')
        return cb(err, feed);
    });

  };

  return this;
}
