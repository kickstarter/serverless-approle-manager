'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const getCreds = require('../lib/getCreds');

describe('The getCreds function', () => {
  it('should exist and be a function', () => {
    expect(getCreds).to.exist;
    expect(getCreds).to.be.a('function');
  });
  it('should retrieve a role_id and a secret_id', () => {
    const requestPromise = () => {
      return Promise.resolve("{\"token\":\"XYZ\", \"data\": {\"role_id\":\"1234\", \"secret_id\":\"secret\"}, \"role_id\":\"1234\"}");
    };
    const functionCall = getCreds('XYZ', 'role', 'service', 'environement', requestPromise);
    return expect(functionCall).to.eventually.eql({secret_id:"secret", role_id:"1234"});
  });
});
