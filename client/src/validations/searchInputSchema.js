import Joi from 'joi';

const searchInputSchema = Joi.object({
    inputOne: Joi
        .string()
        .pattern(new RegExp(/^\d{3}$/))
        .required()
        .messages({
            'string.empty': `"Input one" cannot be an empty field`,
            'string.base': `"Input one" must be a number`,
            'string.pattern.base': `"Input one" must be a number of length 3`,
            'any.required': `"Input one" is required`,
        }),
    inputTwo: Joi
        .string()
        .pattern(new RegExp(/^\d{3}$/))
        .required()
        .messages({
            'string.empty': `"Input two" cannot be an empty field`,
            'string.base': `"Input two" must be a number`,
            'string.pattern.base': `"Input two" must be a number of length 3`,
            'any.required': `"Input two" is required`,
        }),
    inputThree: Joi
        .string()
        .pattern(new RegExp(/^\d{2}$/))
        .required()
        .messages({
            'string.empty': `"Input three" cannot be an empty field`,
            'string.base': `"Input three" must be a number`,
            'string.pattern.base': `"Input three" must be a number of length 2`,
            'any.required': `"Input three" is required`,
        }),
});

export default searchInputSchema;