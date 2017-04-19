'use strict';

const expect = require('chai').expect;
const handler = require('../index').handler;

describe('The handler', () => {
  it('should exist and be a function', () => {
    expect(handler).to.exist;
    expect(handler).to.be.a('function');
  });
});
