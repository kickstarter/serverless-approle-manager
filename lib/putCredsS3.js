'use strict';

module.exports = (creds, IamRole, putObjectPromise) => {
  const putParams = {
    Bucket: process.env.CONFIG_BUCKET,
    Key: 'vault/appRole/' + IamRole,
    ServerSideEncryption: 'AES256',
    Body: JSON.stringify(creds)
  };
  return putObjectPromise(putParams);
};
