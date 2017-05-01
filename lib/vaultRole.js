'use strict';
const fs = require('fs');

module.exports = (tokenPromise) => {
  return {
    addRole: (iamRole, service, environment, request) => {
      const policy = service + '-' + environment;
      return tokenPromise
        .then( (token) => requestHelper(token, policy, iamRole, 'POST', request));
    },

    deleteRole: (iamRole, service, environment, request) => {
      const policy = service + '-' + environment;
      return tokenPromise
        .then( (token) => requestHelper(token, policy, iamRole, 'DELETE', request));
    }
  }
};

const requestHelper = (token, policy, iamRole, action, request) => {
  const options = {
    method: action,
    host: process.env.VAULT_HOST,
    port: '8200',
    path: '/v1/auth/approle/role/' + iamRole,
    body: {
      policies: policy,
      secret_id_ttl:"8760h",
      token_ttl:"48h",
      token_max_ttl:"48h"
    },
    json: true,
    ca: fs.readFileSync('./ca.pem'),
    headers: {
      "X-Vault-Token": token,
      "cache-control": "no-cache"
    }
  };
  return request(options)
    .then(() => (token));
};
