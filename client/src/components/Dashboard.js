import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { showPremiumCustomersByCountry } from '../hooks/fetchClients';
import { countryNamesAndCodes } from '../utils/countryNamesAndCodes';
import { useQuery } from '@tanstack/react-query';

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

    if (isError) {
        return <div>Error! {error}</div>;
    }

    return (
        <div className="dashboard-wrapper">
            <div className="buttons">
                <button className="button-go-back" onClick={() => navigate(-1)}>Go Back</button>
            </div>

            <div>
                <label htmlFor="Country name"></label>
                <select name="country_name" required onChange={handleCountryChange}>
                    <option value="------Select a Country------">------Select a Country------</option>
                    {Object.entries(countryNamesAndCodes).map(country => (
                        <option key={country[0]} value={country[0]}>{country[0]}</option>
                    ))}
                </select>
            </div>
            {premiumCustomers?.country_name && premiumCustomers?.country_name !== '------Select a Country------' && (
                <div className='premium-customers'>
                    <p>The number of premium customers in</p>
                    <span>{premiumCustomers?.country_name}</span>
                    <p>is</p>
                    <span>{premiumCustomers?.count}</span>
                </div>
            )}
            <div>Customers about to reach credit card limit</div>
        </div>
    )
}

export default Dashboard;