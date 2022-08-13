import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { searchByAccountNumber } from '../hooks/fetchClients';
import useDebounce from '../hooks/useDebounce';

export const SendMoneyModal = ({ setOpenSendMoneyModal, data }) => {
    const [searchInputText, setSearchInputText] = useState('');
    const [UserByAccount, setUserByAccount] = useState();

    const accountNumber = useDebounce(searchInputText, 1500);

    // searchByAccountNumber(accountNumber);
    const { data: userData, error, isError, isLoading } = useQuery(['account', accountNumber], () => searchByAccountNumber(accountNumber), {
        onSuccess: (user) => {
            setUserByAccount(user);
        }
    });

    const currentClientId = data?.[0].client_id;
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSearchInputText(e.target.value);
    }

    return (
        <>
            <div className='modal-bg' onClick={() => setOpenSendMoneyModal(false)} />
            <div className='centered'>
                <div className='modal-money'>
                    <div className="modal-top">
                        <div className='modal-header'>
                            <h5 className='heading'>Send Money</h5>
                        </div>
                        <div className="column">
                            <div className="from">
                                <div className="modal-inputs">
                                    <span className='label'>Name</span>
                                    <p className='value'>{data[0]?.first_name}{' '}{data[0]?.last_name}</p>
                                    <span className='label'>Account Number</span>
                                    <p className='value'>{data[0]?.account_number}</p>
                                    <span className='label'>Deposited Amount</span>
                                    <p className='value'>{data[0]?.deposited_amount.slice(0, -2)}</p>
                                    <span className='label'>Currency Code</span>
                                    <p className='value'>{data[0]?.currency_code}</p>
                                </div>
                            </div>
                            <div className="to">
                                <label htmlFor="search-input">Search by account number</label>
                                <input
                                    type="text"
                                    id='search-input'
                                    className="search"
                                    value={searchInputText}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="modal-bottom">
                        <div className='modal-content'>
                            Are you sure you want to send the money?
                        </div>
                        <div className='modal-actions'>
                            <div className='actions-container'>
                                <button className='delete-btn' >
                                    Change
                                </button>
                                <button
                                    className='cancel-btn'
                                    onClick={() => setOpenSendMoneyModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
