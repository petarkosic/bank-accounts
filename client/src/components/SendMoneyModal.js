import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { searchByAccountNumber, sendMoney } from '../hooks/fetchClients';
import useDebounce from '../hooks/useDebounce';

export const SendMoneyModal = ({ setOpenSendMoneyModal, data }) => {
    const [searchInputText, setSearchInputText] = useState('');
    const [userByAccount, setUserByAccount] = useState();
    const [amountOfMoney, setAmountOfMoney] = useState(0);

    const accountNumber = useDebounce(searchInputText, 1500);

    // searchByAccountNumber(accountNumber);
    const { data: userData, error, isError, isLoading } = useQuery(['account', accountNumber], () => searchByAccountNumber(accountNumber), {
        onSuccess: (user) => {
            setUserByAccount(user);
        }
    });

    const currentClientId = data?.[0].client_id;
    const navigate = useNavigate();

    const { mutate } = useMutation(sendMoney);

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSend = {
            from: currentClientId,
            to: userByAccount?.client?.client_id,
            amount: amountOfMoney,
        }

        mutate(dataToSend);
        navigate(0);
    }

    const handleChange = (e) => {
        setSearchInputText(e.target.value);
    }

    const handleMoneyAmountChange = (e) => {
        setAmountOfMoney(e.target.value);
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error! {error}</div>;
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
                                <div className="modal-inputs">
                                    {userByAccount?.client && (
                                        <>
                                            <span className='label'>Name</span>
                                            <p className='value'>{userByAccount?.client?.first_name}{' '}{userByAccount?.client?.last_name}</p>
                                            <span className='label'>Account Number</span>
                                            <p className='value'>{userByAccount?.client?.account_number}</p>
                                            <span className='label'>Deposited Amount</span>
                                            <p className='value'>{userByAccount?.client?.deposited_amount.slice(0, -2)}</p>
                                            <span className='label'>Currency Code</span>
                                            <p className='value'>{userByAccount?.client?.currency_code}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='money-input'>
                        <label htmlFor="send-money">Send Money</label>
                        <input
                            type="text"
                            id='send-money'
                            className="search"
                            value={amountOfMoney}
                            onChange={handleMoneyAmountChange}
                        />
                    </div>
                    <div className="modal-bottom">
                        <div className='modal-content'>
                            Are you sure you want to send the money?
                        </div>
                        <div className='modal-actions'>
                            <div className='actions-container'>
                                <button
                                    className='delete-btn'
                                    onClick={(e) => handleSubmit(e)}
                                >
                                    Send
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
