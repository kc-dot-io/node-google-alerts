
  // Example for how to create a new alert with this module
  // Usage: USER=something@gmail.com PASS=password node example.js

  var ga = require('index');
  var alerts = new ga({ user: process.env.USER, pass: process.env.PASS });

  alerts
    .create({
      query: 'Node.js',
      type: 'everything',
      interval: 'realtime',
      criteria: 'all',
      delivery: 'mail@slajax.com'
    },
    function(err, feed_url) {
      console.log(feed_url);
    });
