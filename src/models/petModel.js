const Joi = require("joi");

const petSchema = Joi.object({
  name: Joi.string().required(),
  species: Joi.string().valid("dog", "cat").required(),
  breed: Joi.string().required(),
  age: Joi.number().integer().required(),
});

module.exports = petSchema;
