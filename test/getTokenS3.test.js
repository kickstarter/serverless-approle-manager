'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const getTokenS3 = require('../lib/getTokenS3');

describe('The getTokenS3 function', () => {
  it('should exist and be a function', () => {
    expect(getTokenS3).to.exist;
    expect(getTokenS3).to.be.a('function');
  });

  it('should return a string', () => {
    const getObjectPromise = () => {
      return Promise.resolve({Body: 'token'});
    };
    const functionCall = getTokenS3(getObjectPromise);
    return expect(functionCall).to.eventually.eql('token');
  });

  it('should throw an error if AWS returns an empty object', () => {
    const getObjectPromise = () => {
      return Promise.resolve({});
    };
    const functionCall = getTokenS3(getObjectPromise);
    return expect(functionCall).to.eventually.be.rejected;
  });
});
