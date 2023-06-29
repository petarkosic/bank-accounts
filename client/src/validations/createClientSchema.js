import Joi from "joi";

const createClientSchema = Joi.object({
    first_name: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]+$'))
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': `"First name" cannot be an empty field`,
            'string.min': `"First name" should have at least {#limit} characters`,
            'string.max': `"First name" should have at max {#limit} characters`,
            'string.pattern.base': `"First name" must contain letters only`,
            'any.required': `"First name" is a required field`,
        }),
    last_name: Joi.string()
        .pattern(new RegExp('^[a-zA-Z]+$'))
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': `"Last name" cannot be an empty field`,
            'string.min': `"Last name" should have at least {#limit} characters`,
            'string.max': `"Last name" should have at max {#limit} characters`,
            'string.pattern.base': `"Last name" must contain letters only`,
            'any.required': `"Last name" is a required field`,
        }),
    date_of_birth: Joi.string()
        .pattern(new RegExp('\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])'))
        .required()
        .messages({
            'string.empty': `"Date of Birth" cannot be an empty field`,
            'string.pattern.base': `"Date of Birth" must be formatted as YYYY-MM-DD`,
            'any.required': `"Date of Birth" is a required field`,
        }),
    country_name: Joi.string()
        .required()
        .messages({
            'string.empty': `"Country name" cannot be an empty field`,
            'any.required': `"Country name" is a required field`,
        }),
    country_code: Joi.string()
        .required()
        .messages({
            'string.empty': `"Country Code" cannot be an empty field`,
            'any.required': `"Country Code" is a required field`,
        }),
    street_name: Joi.string()
        .max(255)
        .required()
        .messages({
            'string.empty': `"Street name" cannot be an empty field`,
            'string.max': `"Street name" should have at max {#limit} characters`,
            'any.required': `"Street name" is a required field`,
        }),
    house_number: Joi.string()
        .min(1)
        .max(30)
        .required()
        .messages({
            'string.empty': `"House Number" cannot be an empty field`,
            'string.min': `"House Number" should have at least {#limit} characters`,
            'string.max': `"House Number" should have at max {#limit} characters`,
            'any.required': `"House Number" is a required field`,
        }),
    postal_code: Joi.string()
        .min(1)
        .max(10)
        .required()
        .messages({
            'string.empty': `"Postal Code" cannot be an empty field`,
            'string.min': `"Postal Code" should have at least {#limit} characters`,
            'string.max': `"Postal Code" should have at max {#limit} characters`,
            'any.required': `"Postal Code" is a required field`,
        }),
    account_number: Joi.string()
        .pattern(new RegExp('^\\d{3}-\\d{3}-\\d{2}$'))
        .required()
        .messages({
            'string.empty': `"Account Number" cannot be an empty field`,
            'string.pattern.base': `"Account Number" must be formatted as XXX-XXX-XX`,
            'any.required': `"Account Number" is a required field`,
        }),
    currency_name: Joi.string()
        .required()
        .messages({
            'string.empty': `"Currency name" cannot be an empty field`,
            'any.required': `"Currency name" is a required field`,
        }),
    currency_code: Joi.string()
        .pattern(new RegExp('^[A-Z]{3}$'))
        .required()
        .messages({
            'string.empty': `"Currency Code" cannot be an empty field`,
            'string.pattern.base': `"Currency Code" must be formatted as USD, EUR, GBP...`,
            'any.required': `"Currency Code" is a required field`,
        }),
    deposited_amount: Joi.string()
        .pattern(new RegExp('^[0-9]+$'))
        .min(0)
        .required()
        .messages({
            'string.empty': `"Deposited Amount" cannot be an empty field`,
            'string.pattern.base': `"Deposited Amount" must be a number`,
            'any.required': `"Deposited Amount" is a required field`,
        }),
    type_of_customer: Joi.string()
        .pattern(new RegExp('^(regular|premium)$'))
        .required()
        .messages({
            'string.empty': `"Type of Customer" cannot be an empty field`,
            'string.pattern.base': `"Type of Customer" must be regular or premium`,
            'any.required': `"Type of Customer" is a required field`,
        }),
    type_of_account: Joi.string()
        .pattern(new RegExp('^(credit|debit)$'))
        .required()
        .messages({
            'string.empty': `"Type of Account" cannot be an empty field`,
            'string.pattern.base': `"Type of Account" must be credit or debit`,
            'any.required': `"Type of Account" is a required field`,
        }),
    credit_payment: Joi.string()
        .pattern(new RegExp('^(monthly|quarterly|yearly)$'))
        .required()
        .messages({
            'string.empty': `"Credit Payment" cannot be an empty field`,
            'string.pattern.base': `"Credit Payment" must be monthly, quarterly or yearly`,
            'any.required': `"Credit Payment" is a required field`,
        }),
});

export default createClientSchema;
