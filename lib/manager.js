'use strict';

const vaultRole = require('./vaultRole');
const getCreds = require('./getCreds');
const getToken = require('./getTokenS3');
const putCredsS3 = require('./putCredsS3');


module.exports = (deps) => {

  const arn = 'arn:aws:s3:::ksr-config/vault/appRole/' + deps.Iam;
  const vault = vaultRole(getToken(deps.S3GetObject));
  const deleteFlow = () => vault.deleteRole(deps.Iam, deps.Service, deps.Environment, deps.Request);
  const deleteOldFlow = () => vault.deleteRole(deps.OldIam, deps.Service, deps.Environment, deps.Request);
  const createFlow = () => vault.addRole(deps.Iam, deps.Service, deps.Environment, deps.Request)
                      .then((token) => (getCreds(token, deps.Iam, deps.Service, deps.Environment, deps.Request)))
                      .then((creds) => (putCredsS3(creds, deps.Iam, deps.S3PutObject)));
  const flow = {
    "Delete": deleteFlow,
    "Create": createFlow,
    "Update": () => (Promise.all([deleteOldFlow, createFlow]))
  };

  return (event, context) => {
    console.log('event=', JSON.stringify(event, null, 2));
    const requestType = event.RequestType;

    return flow[requestType]()
      .then(() => (deps.Response(event, context, 'SUCCESS', {s3arn: arn})))
      .catch((err) => {
        console.log('error = ', err);
        return deps.Response(event, context, 'FAILED', err);
      });
  }
}
