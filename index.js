/**
This lambda function creates a role on Vault for a service+env. It retrieves the secretId and roleId for this role and put it on S3
This function is built in a VPC and can not be tested locally
**/
'use strict';

const manager = require('./lib/manager');
const defaultDependencies = require('./lib/defaultDependencies');

exports.handler = (event, context) => {
  console.log('event=', JSON.stringify(event));
  const dependencies = defaultDependencies(event);
  const run = manager(dependencies);
  return Promise.resolve(run(event, context));
};
