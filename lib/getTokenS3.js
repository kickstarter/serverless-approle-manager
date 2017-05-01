'use strict';
const getParams = { Bucket: process.env.CONFIG_BUCKET, Key: process.env.TOKEN_KEY };

module.exports = (getObjectPromise) => {
  return getObjectPromise(getParams)
    .then((data) => (data.Body.toString('utf-8').replace(/\n/g, '')));
};
