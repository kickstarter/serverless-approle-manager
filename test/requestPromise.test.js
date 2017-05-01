'use strict';

const expect = require('chai').expect;
const requestPromise = require('../lib/requestPromise');

describe('The requestPromise helper', () => {
  it('should exist and be a function', () => {
    expect(requestPromise).to.exist;
    expect(requestPromise).to.be.a('function');
  });
});
