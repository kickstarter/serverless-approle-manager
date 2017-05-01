'use strict';

const AWS = require('aws-sdk');
const region = 'us-east-1';
const s3 = new AWS.S3({ region: region });
const response = require('lambda-cfn-response');
const request = require('./requestPromise');

module.exports = (event) => {
  // Adding a check to make sure ResourceProperties are set up accordingly
  if (!event.ResourceProperties
    || !event.ResourceProperties.Environment
    || !event.ResourceProperties.Service
    || !event.ResourceProperties.Iam) {
    throw new Error('Missing resource properties');
  }
  const service = event.ResourceProperties.Service;
  const env = event.ResourceProperties.Environment;
  const iamRole = event.ResourceProperties.Iam;
  let oldIamRole = '';

  if (event.ResourceProperties && event.ResourceProperties.OldResourceProperties){
    oldIamRole = event.ResourceProperties.OldResourceProperties.Iam;
  }

  return {
    S3GetObject: (params) => s3.getObject(params).promise(),
    S3PutObject: (params) => s3.putObject(params).promise(),
    Response: response,
    Service: service,
    Environment: env,
    Iam: iamRole,
    OldIam: oldIamRole,
    Request: request
  };
};
