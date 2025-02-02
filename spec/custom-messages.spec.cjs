import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("Validator custom messages", function() {
  it("override the default message for the validator", function() {
    const validator = new Validator({ name: "" }, { name: "required" }, { required: "Name is missing." });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.get("name").length).to.equal(1);
    expect(validator.errors.first("name").message).to.equal("Name is missing.");
  });

  it("override the default message for a type of the validator", function() {
    const validator = new Validator(
      { name: "A" },
      { name: "min:4" },
      {
        min: {
          string: ":attribute is not long enough. Should be :min."
        }
      }
    );
    expect(validator.fails()).to.be.true;
    expect(validator.errors.get("name").length).to.equal(1);
    expect(validator.errors.first("name").message).to.equal("name is not long enough. Should be 4.");
  });

  it("override the default message for the validator with several :attribute in message", function() {
    const validator = new Validator(
      { name: "" },
      { name: "required" },
      {
        required: ":attribute is required. :attribute can't be empty."
      }
    );
    expect(validator.fails()).to.be.true;
    expect(validator.errors.get("name").length).to.equal(1);
    expect(validator.errors.first("name").message).to.equal("name is required. name can't be empty.");
  });

  it("override the default message for a type of the validator", function() {
    const validator = new Validator(
      { name: "A" },
      {
        name: "min:4"
      },
      {
        min: {
          string: ":attribute is not long enough. Should be :min."
        }
      }
    );
    expect(validator.fails()).to.be.true;
    expect(validator.errors.get("name").length).to.equal(1);
    expect(validator.errors.first("name").message).to.equal("name is not long enough. Should be 4.");
  });

  it("override the default message for a type of the validator with several :attribute and :min in message", function() {
    const validator = new Validator(
      {
        name: "A"
      },
      {
        name: "min:4"
      },
      {
        min: {
          string:
            ":attribute is not long enough. :attribute should be :min. Because needed string with :min symbols or more."
        }
      }
    );
    expect(validator.fails()).to.be.true;
    expect(validator.errors.get("name").length).to.equal(1);
    expect(validator.errors.first("name").message).to.equal(
      "name is not long enough. name should be 4. Because needed string with 4 symbols or more."
    );
  });

  it("can be specified on a per attribute basis for a validator", function() {
    const validator = new Validator(
      {
        name: "",
        email: ""
      },
      {
        name: "required",
        email: "required"
      },
      {
        "required.name": "Name is missing."
      }
    );
    expect(validator.fails()).to.be.true;
    expect(validator.errors.get("name").length).to.equal(1);
    expect(validator.errors.first("name").message).to.equal("Name is missing.");
    expect(validator.errors.get("email").length).to.equal(1);
    expect(validator.errors.first("email").message).to.equal("validation.required");
  });

  it("can be specified for custom validators", function() {
    Validator.register(
      "telephone",
      function(value, requirement, attribute) {
        return value.match(/^\d{3}-\d{3}-\d{4}$/);
      },
      "The :attribute phone number is not in the format XXX-XXX-XXXX."
    );

    const validator = new Validator(
      {
        phone: "1234567890"
      },
      {
        phone: "telephone"
      },
      {
        telephone: "Wrong number."
      }
    );
    expect(validator.fails()).to.be.true;
    expect(validator.errors.get("phone").length).to.equal(1);
    expect(validator.errors.first("phone").message).to.equal("Wrong number.");
  });

  it("can be specified for custom validators per attribute", function() {
    Validator.register(
      "telephone",
      function(value, requirement, attribute) {
        return value.match(/^\d{3}-\d{3}-\d{4}$/);
      },
      "The :attribute phone number is not in the format XXX-XXX-XXXX."
    );

    const validator = new Validator(
      {
        phone: "1234567890",
        fax: "1234567890"
      },
      {
        phone: "telephone",
        fax: "telephone"
      },
      {
        "telephone.fax": "Why are you even using a fax?"
      }
    );
    expect(validator.fails()).to.be.true;
    expect(validator.errors.get("phone").length).to.equal(1);
    expect(validator.errors.first("phone").message).to.equal("The phone phone number is not in the format XXX-XXX-XXXX.");
    expect(validator.errors.get("fax").length).to.equal(1);
    expect(validator.errors.first("fax").message).to.equal("Why are you even using a fax?");
  });
});
