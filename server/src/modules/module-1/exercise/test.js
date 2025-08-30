const { expect } = require('chai');

describe('Greeting Function', () => {
  let greetings;

  before(() => {
    try {
      greetings = require('./main');
    } catch (error) {
      throw new Error('Could not load main module. Make sure main.js exists and exports greetUser function.');
    }
  });

  it('should export greetUser function', () => {
    expect(greetings).to.have.property('greetUser');
    expect(greetings.greetUser).to.be.a('function');
  });

  it('should return correct greeting for "Alice"', () => {
    const result = greetings.greetUser('Alice');
    expect(result).to.equal('Hello, Alice! Welcome to Node.js!');
  });

  it('should return correct greeting for "Bob"', () => {
    const result = greetings.greetUser('Bob');
    expect(result).to.equal('Hello, Bob! Welcome to Node.js!');
  });

  it('should return correct greeting for "Charlie"', () => {
    const result = greetings.greetUser('Charlie');
    expect(result).to.equal('Hello, Charlie! Welcome to Node.js!');
  });

  it('should return correct greeting for "Diana"', () => {
    const result = greetings.greetUser('Diana');
    expect(result).to.equal('Hello, Diana! Welcome to Node.js!');
  });

  it('should return correct greeting for "Eve"', () => {
    const result = greetings.greetUser('Eve');
    expect(result).to.equal('Hello, Eve! Welcome to Node.js!');
  });

  it('should handle empty string input', () => {
    const result = greetings.greetUser('');
    expect(result).to.equal('Hello, ! Welcome to Node.js!');
  });

  it('should handle special characters in name', () => {
    const result = greetings.greetUser('John-Doe');
    expect(result).to.equal('Hello, John-Doe! Welcome to Node.js!');
  });
});
