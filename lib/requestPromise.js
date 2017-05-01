'use strict';

const https = require('https');
// Inspired from https://gist.github.com/ktheory/df3440b01d4b9d3197180d5254d7fb65

module.exports = ((urlOptions) => {
  return new Promise((resolve, reject) => {
    const data = (JSON.stringify(urlOptions.body)) || '';

    const req = https.request(urlOptions,
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk.toString()));
        res.on('error', reject);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve(body);
          } else {
            reject('Request failed. status: ' + res.statusCode + ', body: ' + body);
          }
        });
      });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
});
