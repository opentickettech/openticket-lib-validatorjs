import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("implicit rule tests", function() {
  it("should fail implicit rule even when undefined", function() {
    Validator.registerImplicit(
      "null_or_number",
      function(val) {
        return (val && val.match(/^\d*$/)) || val === null;
      },
      ":attribute must be a number or empty"
    );

    const validator = new Validator(
      {
        /* empty */
      },
      { value: "null_or_number" }
    );
    expect(validator.passes()).to.be.false;
  });

  it("should pass implicit rule even when null", function() {
    Validator.registerImplicit(
      "null_or_number",
      function(val) {
        return (val && val.match(/^\d*$/)) || val === null;
      },
      ":attribute must be a number or empty"
    );

    const validator = new Validator({ value: null }, { value: "null_or_number" });
    expect(validator.passes()).to.be.true;
  });

  it("should fail async implicit rule even when undefined", () => new Promise(done => {
    Validator.registerAsyncImplicit(
      "async_null",
      function(value, attribute, req, passes) {
        setTimeout(function() {
          if (value === null) {
            passes(true);
          } else {
            passes(false);
          }
        }, 50);
      },
      ":attribute already taken"
    );

    const validator = new Validator(
      {
        /* empty */
      },
      { value: "async_null" }
    );
    validator.fails(done);
  }));

  it("should pass async implicit rule even when null", () => new Promise(done => {
    Validator.registerAsyncImplicit(
      "async_null",
      function(value, attribute, req, passes) {
        setTimeout(function() {
          if (value === null) {
            passes(true);
          } else {
            passes(false);
          }
        }, 50);
      },
      ":attribute already taken"
    );

    const validator = new Validator({ value: null }, { value: "async_null" });
    validator.passes(done);
  }));
});
