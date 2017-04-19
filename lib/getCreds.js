'use strict';

const fs = require('fs');

module.exports = (token, iamRole, service, environment, request) => {
  const defaultOptions = {
    port: '8200',
    host: process.env.VAULT_HOST,
    ca: fs.readFileSync('./ca.pem'),
    headers: {
      "X-Vault-Token": token,
      "cache-control": "no-cache"
    }
  };
  const roleIdOptions = {
    method: 'GET',
    path: '/v1/auth/approle/role/' + iamRole + '/role-id'
  };

  const options = Object.assign({}, defaultOptions, roleIdOptions);

  return request(options)
    .then(JSON.parse)
    .then((role)=> ({ token: token, role_id: role.data.role_id }))
    // Get SecretID from Vault
    .then((data) => {
      const vaultToken = data.token;
      const secretIdOptions = {
        method: 'POST',
        path: '/v1/auth/approle/role/' + iamRole + '/secret-id'
      };

      const postOptions = Object.assign({}, defaultOptions, secretIdOptions);
      return request(postOptions)
        .then((response) => {
          const secretIdObject = JSON.parse(response);
          return Object.assign({}, {role_id: data.role_id, secret_id: secretIdObject.data.secret_id});
        });
    });
};
