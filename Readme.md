# node-google-alerts

Create custom google alerts from Node.js

## Installation

`npm install git@github.com:slajax/node-google-alerts.git`

## Usage

```javascript

  var ga = require('node-google-alerts');
  var alerts = new ga({ user: 'someone@gmail.com', pass: 'password' });

  alerts.create('A new alert with default settings');

  alerts.create({
    query: 'Doge wow',
    type: 'news',
    interval: 'realtime',
    criteria: 'best',
    delivery: 'email@domain.com'
  });

```

## Disclaimer

```
  wow
      very very alpha 0.0.1
    nice alerts
```

## License

(The MIT License)

Copyright (c) 2013 Kyle Campbell <mail@slajax.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the 'Software'),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

