import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient, getAccountNumber } from '../hooks/fetchClients';
import { countryNamesAndCodes } from '../utils/countryNamesAndCodes';

const CreateClient = () => {
    const [accountNumber, setAccountNumber] = useState('');
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

    const handleCountryChange = e => {
        const countryCode = getCountryCode(e.target.value);

        setData({
            ...data,
            country_name: e.target.value,
            country_code: countryCode,
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        mutate(data);
        navigate(-1);
    }

    const handleClick = async () => {
        const { accountNumber } = await getAccountNumber();
        setAccountNumber(accountNumber);
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
                            <label htmlFor="country-name" className='label'>Country name</label>
                            <div>
                                <select name="country_name" id="" onChange={handleCountryChange}>
                                    <option value="------Select a Country------">------Select a Country------</option>
                                    {Object.entries(countryNamesAndCodes).map(country => (
                                        <option key={country[0]} value={country[0]}>{country[0]}</option>
                                    ))}
                                </select>
                            </div>
                            {data.country_name === '' && (
                                <p className='error'>Please select a country</p>
                            )}
                            <label htmlFor="country-code" className='label'>Country code</label>
                            <div>
                                {data.country_code}
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
                                <input type="text" name='account_number' id="account-number" onChange={handleChange} disabled={true} value={accountNumber} />
                                <button
                                    className='button-get-new-number'
                                    onClick={handleClick}

                                >Get New Number</button>
                            </div>
                            <label htmlFor="currency-name" className='label'>Currency name</label>
                            <input type="text" name='currency_name' id="currency-name" onChange={handleChange} />
                            <label htmlFor="currency-code" className='label'>Currency code</label>
                            <input type="text" name='currency_code' id="currency-code" onChange={handleChange} />
                            <label htmlFor="deposited-amount" className='label'>Deposited amount</label>
                            <input type="text" name='deposited_amount' id="deposited-amount" onChange={handleChange} />
                            <label htmlFor="type-of-customer" className='label'>Type of customer</label>
                            <input type="text" name='type_of_customer' id="type-of-customer" onChange={handleChange} />
                            <label htmlFor="type-of-account" className='label'>Type of account</label>
                            <input type="text" name='type_of_account' id="type-of-account" onChange={handleChange} />
                            <label htmlFor="credit-payment" className='label'>Credit payment</label>
                            <input type="text" name='credit_payment' id="credit-payment" onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={handleSubmit}>Create Client</button>
        </div>
    )
}

export default CreateClient;