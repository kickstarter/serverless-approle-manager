'use strict';

const chai = require('chai');
const expect = chai.expect;
const defaultDependencies = require('../lib/defaultDependencies');
const event = require('./data/event').create;

describe('The defaultDependencies function', () => {
  it('should exist and be a function', () => {
    expect(defaultDependencies).to.exist;
    expect(defaultDependencies).to.be.a('function');
  });

  it('should return an object', () => {
    expect(defaultDependencies(event)).to.be.an('object');
  });

  it('should return an object with eight dependencies', () => {
    expect(defaultDependencies(event).S3GetObject).to.exist;
    expect(defaultDependencies(event).S3PutObject).to.exist;
    expect(defaultDependencies(event).Environment).to.exist;
    expect(defaultDependencies(event).Service).to.exist;
    expect(defaultDependencies(event).Iam).to.exist;
    expect(defaultDependencies(event).OldIam).to.exist;
    expect(defaultDependencies(event).Request).to.exist;
    expect(defaultDependencies(event).Response).to.exist;
  });
});
