'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const manager = require('../lib/manager');
const createEvent = require('./data/event').create;
const updateEvent = require('./data/event').update;
const context = {};
const deps = {
    S3GetObject: () =>  (Promise.resolve({Body:'token'})),
    S3PutObject: () => { return Promise.resolve(); },
    Response: (event, context, arg, data) => {
      return arg === 'SUCCESS'
        ? Promise.resolve('it worked well')
        : Promise.reject('it failed');
       },
    Service: 'service',
    Environment: 'env',
    OldIam: '',
    Iam: 'iamRole',
    Request: (options) => {
      return Promise.resolve("{\"token\":\"XYZ\", \"data\": {\"role_id\":\"1234\", \"secret_id\":\"secret\"}, \"role_id\":\"1234\"}")
      }
};

const runner = manager(deps);
describe('The manager', () => {
  it('should exist and be a function', () => {
    expect(runner).to.exist;
    expect(runner).to.be.a('function');
  });

  it('should call response if all the dependencies are working', () => {
    const createCall = runner(createEvent, context);
    return expect(createCall).to.eventually.equal('it worked well');
  });

  it('should send a success response in case of an update', () => {
    const updateDeps = {
      Service: 'service',
      Environment: 'env',
      Iam: 'iamRole',
      OldIam: '',
      S3GetObject: () => { return Promise.resolve(); },
      S3PutObject: () => { return Promise.resolve(); },
      Response: (event, context, arg, data) => {
        return arg === 'SUCCESS'
          ? Promise.resolve('it worked well')
          : Promise.reject('it failed');
        },
      Request: () => {return Promise.resolve();}
    };
    const updateRunner = manager(updateDeps);
    const functionCall = updateRunner(updateEvent, context);
    return expect(functionCall).to.eventually.equal('it worked well');
  });
});
