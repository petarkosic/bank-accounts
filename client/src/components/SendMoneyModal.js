import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { sendMoney } from '../hooks/fetchClients';
import { motion } from 'framer-motion';
import Search from './Search';
import { useSearchClientContext } from '../context/SearchClientContext';

const FEE = 0.01;

export const SendMoneyModal = ({ setOpenSendMoneyModal, data }) => {
    const [amountOfMoney, setAmountOfMoney] = useState(0);
    const [fundsError, setFundsError] = useState(false);
    const [currencyCodeError, setCurrencyCodeError] = useState(false);

    const { user } = useSearchClientContext();

    const currentClientId = data?.[0].client_id;
    const navigate = useNavigate();

    const { mutate } = useMutation(sendMoney);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (Number(data?.[0].deposited_amount) < Number(amountOfMoney)) {
            setFundsError(true);
            setTimeout(() => {
                setFundsError(false);
            }, 3000);
            return;
        }

        if (data?.[0].currency_code !== user?.client?.currency_code) {
            setCurrencyCodeError(true);
            setTimeout(() => {
                setCurrencyCodeError(false);
            }, 3000);
            return;
        }

        const dataToSend = {
            from: currentClientId,
            to: user?.client?.client_id,
            amount: amountOfMoney >= 10000 ? String(Number(amountOfMoney) + (Number(amountOfMoney) * FEE)) : amountOfMoney,
        }
        if (!fundsError) {
            mutate(dataToSend);
            navigate(0);
        }
    }

    const handleMoneyAmountChange = (e) => {
        setAmountOfMoney(e.target.value);
    }

    return (
        <>
            <div className='modal-bg' onClick={() => setOpenSendMoneyModal(false)} />
            <div className='centered'>
                <motion.div
                    className='modal-money'
                    initial={{ opacity: 0, scaleY: 0, x: 300 }}
                    animate={{ opacity: 1, scaleY: 1, x: 0 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                >
                    <div className="modal-top">
                        <div className='modal-header'>
                            <h5 className='heading'>Send Money</h5>
                        </div>
                        <div className="column">
                            <div className="from">
                                <h2 className='column-heading'>FROM</h2>
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
                                <h2 className='column-heading'>TO</h2>
                                <div className="search-container">
                                    <Search />
                                </div>
                                <div className="modal-inputs">
                                    {user?.client && (
                                        <>
                                            <span className='label'>Name</span>
                                            <p className='value'>{user?.client?.first_name}{' '}{user?.client?.last_name}</p>
                                            <span className='label'>Account Number</span>
                                            <p className='value'>{user?.client?.account_number}</p>
                                            <span className='label'>Deposited Amount</span>
                                            <p className='value'>{user?.client?.deposited_amount.slice(0, -2)}</p>
                                            <span className='label'>Currency Code</span>
                                            <p className='value'>{user?.client?.currency_code}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='money-input'>
                        <label htmlFor="send-money">Amount to Send</label>
                        <input
                            type="text"
                            id='send-money'
                            className="search"
                            value={amountOfMoney}
                            onChange={handleMoneyAmountChange}
                        />
                        {fundsError && (
                            <p className='funds-error'>Insufficent Funds</p>
                        )}
                        {currencyCodeError && (
                            <p className='funds-error'>Currencies Do Not Match</p>
                        )}
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
                </motion.div>
            </div>
        </>
    );
}
