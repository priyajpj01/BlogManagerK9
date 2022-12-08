const Joi = require("@hapi/joi");

const loginValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).label("Password").required().messages({
      "string.empty": `Password cannot be an empty field.`,
      "any.required": `Please enter password.`,
      "string.min": `Please enter a valid password with minimum length of 7.`,
      "string.base": `Please enter a valid password password should be a type of 'text'.`,
    }),
    email: Joi.string().email().label("Email").required().messages({
      "string.empty": `{{#label}} cannot be an empty field.`,
      "any.required": `{{#label}} is a required field.`,
      "string.email": `Please enter a valid {{#label}}.`,
    }),
  }).options({ abortEarly: false, errors: { wrap: { label: "``" } } });
  const validation = schema.validate(data);
  return validation;
};

const registerValidation = (data) => {
  var re = /^(?:\d{10}|\w+@\w+\.\w{2,3})$/;
  const schema = Joi.object({
    password: Joi.string().min(6).label("Password").required().messages({
      "string.empty": `Password cannot be an empty field.`,
      "any.required": `Please enter password.`,
      "string.min": `Please enter password with minimum length of 7.`,
      "string.base": `Password should be a type of 'text'.`,
    }),
    email: Joi.string().email().label("Email").required().messages({
      "string.empty": `{{#label}} cannot be an empty field.`,
      "any.required": `{{#label}} is a required field.`,
      "string.email": `Please enter a valid {{#label}}.`,
    }),
    name: Joi.string().min(3).max(30).label("Name").required().messages({
      "string.empty": `{{#label}} cannot be an empty field.`,
      "any.required": `{{#label}} is a required field.`,
      "string.min": `Please enter {{#label}} which should be at least 3 characters long.`,
      "string.max": `Please enter {{#label}} whose length must not be more than 30 characters long.`,
      "string.base": `{{#label}} should not contain numbers.`,
    }),
    age: Joi.number().label("Age").messages({
      "number.base": "{{#label}} should be in numbers.",
    }),
  }).options({ abortEarly: false, errors: { wrap: { label: "``" } } });
  const validation = schema.validate(data);
  return validation;
};


module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;

