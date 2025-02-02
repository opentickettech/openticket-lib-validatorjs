import {
  describe,
  it,
  expect
} from 'vitest';

const { Validator } = require("./setup.cjs");

const validator = new Validator(
  {
    name: "David",
    email: "johndoe@gmail.com",
    salary: "10,000.00",
    birthday: "03/07/1980",
    nick: "Dav"
  },
  {
    name: ["required", "min:3", "max:10"],
    email: ["required", "email"],
    salary: ["required", "regex:/^\\$?(?!0.00)(([0-9]{1,3},([0-9]{3},)*)[0-9]{3}|[0-9]{1,3})(\\.[0-9]{2})?$/"],
    birthday: [
      "required",
      "regex:/^([1-9]|0[1-9]|[12][0-9]|3[01])\\D([1-9]|0[1-9]|1[012])\\D(19[0-9][0-9]|20[0-9][0-9])$/"
    ],
    nick: ["required", "regex:/^X/"]
  }
);

describe("alternative initialization using an array instead pipe", function() {
  it("should fail 1 validation rule", function() {
    expect(validator.passes()).to.be.false;
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("nick").message).to.equal("validation.regex");
  });
}); // Page constructor
