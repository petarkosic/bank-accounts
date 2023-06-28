import Joi from 'joi';

const searchInputSchema = Joi.object({
    inputOne: Joi
        .string()
        .pattern(new RegExp(/^\d{3}$/))
        .required()
        .messages({
            'string.empty': 'Input One cannot be an empty field',
            'string.base': 'Input One must be a number',
            'string.pattern.base': 'Input One must be a number of length 3',
            'any.required': 'Input One is required',
        }),
    inputTwo: Joi
        .string()
        .pattern(new RegExp(/^\d{3}$/))
        .required()
        .messages({
            'string.empty': 'Input Two cannot be an empty field',
            'string.base': 'Input Two must be a number',
            'string.pattern.base': 'Input Two must be a number of length 3',
            'any.required': 'Input Two is required',
        }),
    inputThree: Joi
        .string()
        .pattern(new RegExp(/^\d{2}$/))
        .required()
        .messages({
            'string.empty': 'Input Three cannot be an empty field',
            'string.base': 'Input Three must be a number',
            'string.pattern.base': 'Input Three must be a number of length 2',
            'any.required': 'Input Three is required',
        }),
});

export default searchInputSchema;