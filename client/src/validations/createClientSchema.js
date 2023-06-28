import Joi from "joi";

const registerSchema = Joi.object({
    first_name: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]+$'))
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': `"First Name" cannot be an empty field`,
            'string.min': `"First Name" should have at least {#limit} characters`,
            'string.max': `"First Name" should have at max {#limit} characters`,
            'any.required': `"First Name" is a required field`,
        }),
    last_name: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]+$'))
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': `"Last Name" cannot be an empty field`,
            'string.min': `"Last Name" should have at least {#limit} characters`,
            'string.max': `"Last Name" should have at max {#limit} characters`,
            'any.required': `"Last Name" is a required field`,
        }),
    date_of_birth: Joi.string()
        .pattern(new RegExp('\b\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b'))
        .required()
        .messages({
            'string.empty': `"Date of Birth" cannot be an empty field`,
            'string.pattern.base': 'Date of Birth must be formatted as YYYY-MM-DD',
            'any.required': `"Date of Birth" is a required field`,
        }),
    country_name: Joi.string()
        .required()
        .messages({
            'string.empty': `"Country Name" cannot be an empty field`,
            'any.required': `"Country Name" is a required field`,
        }),
    country_code: Joi.string()
        .required()
        .messages({
            'string.empty': `"Country Code" cannot be an empty field`,
            'any.required': `"Country Code" is a required field`,
        }),
});

export default registerSchema;
