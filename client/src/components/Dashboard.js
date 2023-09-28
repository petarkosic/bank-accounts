import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { customersToReachCardLimit, showPremiumCustomersByCountry } from '../hooks/fetchClients';
import { countryNamesAndCodes } from '../utils/countryNamesAndCodes';
import { useQuery } from '@tanstack/react-query';
import { formatNumber } from '../utils/formatNumber';

// TODO: show customers that are about to reach credit card limit (10% buffer left)
const Dashboard = () => {
    const [countryName, setCountryName] = useState('');
    const [premiumCustomers, setPremiumCustomers] = useState(null);
    const navigate = useNavigate();

    function handleCountryChange(e) {
        setCountryName(e.target.value);
    }

    const { error, isError } = useQuery(['premium-country', countryName], () => showPremiumCustomersByCountry(countryName), {
        refetchOnWindowFocus: false,
        enabled: countryName !== '------Select a Country------' || countryName !== '',
        onSuccess: data => {
            setPremiumCustomers(data.premiumCustomers[0])
        },
        onError: error => {
            console.error(error);
        }
    });

    const { data } = useQuery(['card-limit'], () => customersToReachCardLimit(), {
        refetchOnWindowFocus: false
    })

    if (isError) {
        return <div>Error! {error}</div>;
    }

    return (
        <div className="dashboard-wrapper">
            <div className="buttons">
                <button className="button-go-back" onClick={() => navigate(-1)}>Go Back</button>
            </div>

            <div className='premium-customers-by-country'>
                <label htmlFor="Country name">Select a country to see the number of premium customers</label>
                <select name="country_name" required onChange={handleCountryChange}>
                    <option value="------Select a Country------">------Select a Country------</option>
                    {Object.entries(countryNamesAndCodes).map(country => (
                        <option key={country[0]} value={country[0]}>{country[0]}</option>
                    ))}
                </select>
                {premiumCustomers?.country_name && premiumCustomers?.country_name !== '------Select a Country------' && (
                    <div className='premium-customers'>
                        <p>The number of premium customers in{' '}
                            <span>{premiumCustomers?.country_name}</span>
                            {' '}is{' '}
                            <span>{premiumCustomers?.count}</span>
                        </p>
                    </div>
                )}
            </div>
            <p className='customers-card-limit-label'>Customers about to reach credit card limit</p>
            <div className='customers-card-limit'>
                {data?.customersToReachCardLimit?.map(customer => (
                    <div key={customer.client_id} className={`customer-card-limit ${customer.type_of_customer === 'premium' ? 'customer-card-limit-premium' : ''}`}>
                        <p>{customer.first_name} {customer.last_name}</p>
                        <p>{customer.account_number}</p>
                        <p>Balance: {formatNumber(customer.deposited_amount)}</p>
                        <p>Currency: {customer.currency_name}</p>
                        <p>Card limit: {formatNumber(customer.card_limit)}</p>
                        <p>Remaining credit: {formatNumber(customer.remaining_credit)}</p>
                        <Link className="card-limit-view-more" to={`/${customer.client_id}`}>View More</Link>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Dashboard;