import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient, getAccountNumber } from '../hooks/fetchClients';
import { countryNamesAndCodes } from '../utils/countryNamesAndCodes';
import { countriesAndCurrencies } from '../utils/countriesAndCurrencies';
import { currencyNamesAndCodes } from '../utils/currencyNamesAndCodes';
import { creditPayment, typeOfAccount, typeOfCustomer } from '../utils/accountTypes';
import createClientSchema from '../validations/createClientSchema';
import { Input } from './Input';

const CreateClient = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const [data, setData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        country_name: '',
        country_code: '',
        street_name: '',
        house_number: '',
        postal_code: '',
        account_number: '',
        currency_name: '',
        currency_code: '',
        deposited_amount: '',
        type_of_customer: '',
        type_of_account: '',
        credit_payment: '',
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const { mutate } = useMutation(createClient);

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    const getCountryCode = countryName => {
        const countryCode = countryNamesAndCodes[countryName];
        return countryCode || '';
    }

    const getCurrencyName = countryName => {
        const currencyName = countriesAndCurrencies[countryName.toUpperCase()];
        return currencyName || '';
    }

    const getCurrencyCode = currencyName => {
        const currencyCode = currencyNamesAndCodes[currencyName];
        return currencyCode || '';
    }

    const handleCountryChange = e => {
        const countryCode = getCountryCode(e.target.value);
        const currencyName = getCurrencyName(e.target.value);
        const currencyCode = getCurrencyCode(currencyName);

        setData({
            ...data,
            country_name: e.target.value,
            country_code: countryCode,
            currency_name: currencyName,
            currency_code: currencyCode,
        })
    }

    const handleSubmit = e => {
        e.preventDefault();

        const { error } = createClientSchema.validate(data);

        if (error) {
            const validationErrors = {};
            error.details.forEach((detail) => {
                validationErrors[detail.path[0]] = detail.message;
            });
            setErrors(validationErrors);
        } else {
            setErrors({});
            mutate(data);
            navigate(-1);
        }
    }

    const handleClick = async () => {
        const { accountNumber } = await getAccountNumber();
        setData({
            ...data,
            account_number: accountNumber
        })
    }

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        setData({
            ...data,
            type_of_customer: customer,
        })
    };

    const handleAccountClick = (account) => {
        setSelectedAccount(account);
        setData({
            ...data,
            type_of_account: account,
        })
    };

    const handlePaymentClick = (payment) => {
        setSelectedPayment(payment);
        setData({
            ...data,
            credit_payment: payment,
        })
    };

    useEffect(() => {
        handleClick();
    }, [])

    return (
        <div className="create--client--wrapper">
            <div className="buttons">
                <button className="button-go-back" onClick={() => navigate(-1)}>Go Back</button>
            </div>
            <div className="create-client">
                <div className="create-client-left">
                    <div className="column">
                        <div className="create-client-inputs">
                            <Input
                                label={'First name'}
                                type="text"
                                id="first-name"
                                name="first_name"
                                value={data.first_name}
                                onChange={handleChange}
                            />
                            <Input
                                label={'Last name'}
                                type="text"
                                id="last-name"
                                name="last_name"
                                value={data.last_name}
                                onChange={handleChange}
                            />
                            <Input
                                label={'Date of birth'}
                                type="text"
                                id="date-of-birth"
                                name="date_of_birth"
                                value={data.date_of_birth}
                                placeholder='YYYY-MM-DD'
                                onChange={handleChange}
                            />
                            <div className='country-selector-wrapper'>
                                <div className="country-select">
                                    <label htmlFor="country-name" className='label'>Country name</label>
                                    <div>
                                        <select name="country_name" required onChange={handleCountryChange}>
                                            <option value="------Select a Country------">------Select a Country------</option>
                                            {Object.entries(countryNamesAndCodes).map(country => (
                                                <option key={country[0]} value={country[0]}>{country[0]}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="country-code">
                                    <label htmlFor="country-code" className='label'>Country code</label>
                                    {(data.country_name === '' || data.country_name === '------Select a Country------') ? (
                                        <div className='error'>Select a country</div>
                                    ) : (
                                        <div>
                                            {data.country_code}
                                        </div>
                                    )}
                                </div>
                            </div>


                            <Input
                                label="Street name"
                                type="text"
                                id="street-name"
                                name="street_name"
                                value={data.street_name}
                                onChange={handleChange}
                            />
                            <Input
                                label="House number"
                                type="text"
                                id="house-number"
                                name="house_number"
                                value={data.house_number}
                                onChange={handleChange}
                            />
                            <Input
                                label="Postal code"
                                type="text"
                                id="postal-code"
                                name="postal_code"
                                value={data.postal_code}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="create-client-right">
                    <div className="column">
                        <div className="create-client-inputs">
                            <label htmlFor="account-number" className='label'>Account number</label>
                            <div className="get-new-number" >
                                <input type="text" name='account_number' id="account-number" onChange={handleChange} disabled={true} value={data.account_number} />
                                <button
                                    className='button-get-new-number'
                                    onClick={handleClick}

                                >Get New Number</button>
                            </div>

                            <div className="currency-wrapper">
                                <div className="currency-name">
                                    <label htmlFor="currency-name" className='label'>Currency name</label>
                                    {data.currency_name === '' ? (
                                        <div>Select a Country</div>
                                    ) : (
                                        <div>{data.currency_name}</div>
                                    )}
                                </div>
                                <div className="currency-code">
                                    <label htmlFor="currency-code" className='label'>Currency code</label>
                                    {data.currency_code === '' ? (
                                        <div className='error'>No currency</div>
                                    ) : (
                                        <div>{data.currency_code}</div>
                                    )}
                                </div>
                            </div>

                            <Input
                                label="Deposited amount"
                                type="text"
                                id="deposited-amount"
                                name="deposited_amount"
                                value={data.deposited_amount}
                                onChange={handleChange}
                            />
                            <div className="account-types">
                                <div className="types type-of-customer">
                                    <label htmlFor="type-of-customer" className='card-label'>Type of customer</label>
                                    <div className='type-buttons'>
                                        {typeOfCustomer.map((customer, idx) => (
                                            <button className={`button ${selectedCustomer === customer ? 'selected' : ''}`} key={idx} value={customer} onClick={() => handleCustomerClick(customer)}>{customer}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="types type-of-account">
                                    <label htmlFor="type-of-account" className='card-label'>Type of account</label>
                                    <div className='type-buttons'>
                                        {typeOfAccount.map((account, idx) => (
                                            <button className={`button ${selectedAccount === account ? 'selected' : ''}`} key={idx} value={account} onClick={() => handleAccountClick(account)}>{account}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="types credit-payment">
                                    <label htmlFor="credit-payment" className='card-label'>Credit payment</label>
                                    <div className='type-buttons'>
                                        {creditPayment.map((payment, idx) => (
                                            <button className={`button ${selectedPayment === payment ? 'selected' : ''}`} key={idx} value={payment} onClick={() => handlePaymentClick(payment)}>{payment}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <button className='create-new-client-button' onClick={handleSubmit}>Create New Client Account</button>
            <div
                className='error-message'
            >
                {Object.entries(errors).map(error => (
                    <div key={error[0]}>
                        {error[1]}
                    </div>
                ))}
            </div>
        </div >
    )
}

export default CreateClient;