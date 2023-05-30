import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient, getAccountNumber } from '../hooks/fetchClients';
import { countryNamesAndCodes } from '../utils/countryNamesAndCodes';
import { countriesAndCurrencies } from '../utils/countriesAndCurrencies';
import { currencyNamesAndCodes } from '../utils/currencyNamesAndCodes';
import { creditPayment, typeOfAccount, typeOfCustomer } from '../utils/accountTypes';

const CreateClient = () => {
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
        mutate(data);
        navigate(-1);
    }

    const handleClick = async () => {
        const { accountNumber } = await getAccountNumber();
        setData({
            ...data,
            account_number: accountNumber
        })
    }

    const handleTypeClick = value => {
        if (typeOfCustomer.includes(value)) {
            setData({
                ...data,
                type_of_customer: value,
            })
        } else if (typeOfAccount.includes(value)) {
            setData({
                ...data,
                type_of_account: value,
            })
        } else if (creditPayment.includes(value)) {
            setData({
                ...data,
                credit_payment: value,
            })
        }
    }

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
                            <label htmlFor="first-name" className='label'>First name</label>
                            <input type="text" name='first_name' id="first-name" onChange={handleChange} />
                            <label htmlFor="last-name" className='label'>Last name</label>
                            <input type="text" name='last_name' id="last-name" onChange={handleChange} />
                            <label htmlFor="date-of-birth" className='label'>Date of birth</label>
                            <input type="text" name='date_of_birth' id="date-of-birth" placeholder='YYYY-MM-DD' onChange={handleChange} />
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

                            <label htmlFor="street-name" className='label'>Street name</label>
                            <input type="text" name='street_name' id="street-name" onChange={handleChange} />
                            <label htmlFor="house-number" className='label'>House number</label>
                            <input type="text" name='house_number' id="house-number" onChange={handleChange} />
                            <label htmlFor="postal-code" className='label'>Postal code</label>
                            <input type="text" name='postal_code' id="postal-code" onChange={handleChange} />
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

                            <label htmlFor="deposited-amount" className='label'>Deposited amount</label>
                            <input type="text" name='deposited_amount' id="deposited-amount" onChange={handleChange} />

                            <div className="account-types">
                                <div className="types type-of-customer">
                                    <label htmlFor="type-of-customer" className='card-label'>Type of customer</label>
                                    <div className='type-buttons'>
                                        {typeOfCustomer.map((customer, idx) => (
                                            <button className='button' key={idx} value={customer} onClick={() => handleTypeClick(customer)}>{customer}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="types type-of-account">
                                    <label htmlFor="type-of-account" className='card-label'>Type of account</label>
                                    <div className='type-buttons'>
                                        {typeOfAccount.map((account, idx) => (
                                            <button className='button' key={idx} value={account} onClick={() => handleTypeClick(account)}>{account}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="types credit-payment">
                                    <label htmlFor="credit-payment" className='card-label'>Credit payment</label>
                                    <div className='type-buttons'>
                                        {creditPayment.map((payment, idx) => (
                                            <button className='button' key={idx} value={payment} onClick={() => handleTypeClick(payment)}>{payment}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <button className='create-new-client-button' onClick={handleSubmit}>Create New Client Account</button>
        </div >
    )
}

export default CreateClient;