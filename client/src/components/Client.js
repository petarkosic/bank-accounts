import { useState, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { depositOrWithdraw, fetchClient } from './../hooks/fetchClients';
import { useParams, useNavigate } from 'react-router-dom';
import { EditAddressModal } from './EditAddressModal';
import { SwitchCustomerModal } from './SwitchCustomerModal';
import { SendMoneyModal } from './SendMoneyModal';
import { motion } from 'framer-motion';

function Client() {
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [openCustomerModal, setOpenCustomerModal] = useState(false);
    const [openSendMoneyModal, setOpenSendMoneyModal] = useState(false);
    const [typeOfCustomer, setTypeOfCustomer] = useState();
    const [changeAmount, setChangeAmount] = useState(0);
    const [withdrawError, setWithdrawError] = useState(false);

    const { clientId } = useParams();
    const navigate = useNavigate();

    const depositWithdrawButtonRef = useRef();

    const depositWithdrawInputRef = useRef();
    const depositWithdrawSubmitButton = useRef();

    const { data, error, isError, isLoading } = useQuery(['client', clientId], () => fetchClient(clientId), {
        refetchOnWindowFocus: false,
        onSuccess: (type) => {
            setTypeOfCustomer(type?.[0]?.type_of_customer)
        }
    });

    if (openSendMoneyModal) {
        depositWithdrawButtonRef.current.style.display = 'block'
        depositWithdrawInputRef.current.style.display = 'none'
        depositWithdrawSubmitButton.current.style.display = 'none'
    }

    const handleShowInput = e => {
        depositWithdrawButtonRef.current.style.display = 'none'
        depositWithdrawInputRef.current.style.display = 'block'
        depositWithdrawSubmitButton.current.style.display = 'block'
    }

    const { mutate } = useMutation(depositOrWithdraw);

    const handleSubmit = (e) => {
        e.preventDefault();
        setWithdrawError(false);

        const dataToSend = {
            client_id: clientId,
            deposited_amount: Number(data?.[0].deposited_amount) + Number(changeAmount)
        }

        if (Number(changeAmount) < 0) {
            if (Math.abs(Number(changeAmount)) > Number(data?.[0].deposited_amount)) {
                setWithdrawError(true);
                let timeoutId = setTimeout(() => {
                    setWithdrawError(false);
                    clearTimeout(timeoutId);
                }, 3000);
                return;
            }
        }

        mutate(dataToSend);
        navigate(0);
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error! {error}</div>;
    }

    return (
        <div className='client'>
            <div className="buttons">
                <button className="button-go-back" onClick={() => navigate(-1)}>Go Back</button>
                <button className="button-send-money" onClick={() => setOpenSendMoneyModal(true)}>Send Money</button>
                {openSendMoneyModal &&
                    <SendMoneyModal
                        data={data}
                        setOpenSendMoneyModal={setOpenSendMoneyModal}
                    />
                }
            </div>
            {data?.map(client => (
                <motion.div
                    key={client.client_id}
                    className='client-card--wrapper'
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: .1 }}
                >
                    <div className="client-card--container">
                        <div className='client-info'>
                            <div className={`credit-card--info ${typeOfCustomer}`}>
                                <div className="card-left">
                                    <div className="client-fullname">
                                        <p className='account-number'>{client.account_number}</p>
                                        <h1>{client.first_name}{' '}{client.last_name}</h1>
                                    </div>
                                </div>
                                <div className="card-right">
                                    <div className="type">
                                        <p>{client.type_of_account}</p>
                                        <p>{client.type_of_customer}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="switch-account-container">
                                <button className={`button-switch ${typeOfCustomer}`} onClick={() => setOpenCustomerModal(true)}>Switch to {typeOfCustomer === 'premium' ? 'regular' : 'premium'}
                                </button>
                            </div>
                            {openCustomerModal &&
                                <SwitchCustomerModal
                                    setOpenCustomerModal={setOpenCustomerModal}
                                    typeOfCustomer={typeOfCustomer}
                                    clientId={clientId}
                                />
                            }
                            <div className="address">
                                <p>{client.street_name}</p>
                                <p>{client.house_number}</p>
                                <p>{client.postal_code}</p>
                                <p>{client.country_name}</p>
                                <p>({client.country_code})</p>
                                <button className="address-button" onClick={() => setOpenAddressModal(true)}>Change Address</button>
                                {openAddressModal &&
                                    <EditAddressModal
                                        setOpenAddressModal={setOpenAddressModal}
                                        data={data}
                                    />}
                            </div>
                        </div>
                        <div className="client-money">
                            <p>Card limit: {client.card_limit}</p>
                            <p>Credit payment: {client.credit_payment}</p>
                            <div className="money-deposit">
                                <p>Balance: {client.deposited_amount?.slice(0, -2)}</p>
                                <button
                                    ref={depositWithdrawButtonRef}
                                    onClick={e => handleShowInput(e)}
                                >
                                    Deposit or Withdraw
                                </button>
                                <div className="input-amount">
                                    <input
                                        type="text"
                                        ref={depositWithdrawInputRef}
                                        onChange={e => setChangeAmount(e.target.value)}
                                        style={{ display: 'none', border: withdrawError ? '1px solid red' : 'none' }}
                                        placeholder='Amount' />
                                    {withdrawError && (
                                        <p className='error-message withdraw-error'>Cannot withdraw more than your balance</p>
                                    )}
                                    <button
                                        type='submit'
                                        ref={depositWithdrawSubmitButton}
                                        style={{ display: 'none' }}
                                        className="submit-button"
                                        onClick={e => handleSubmit(e)}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                            <p>Currency name: {client.currency_name}</p>
                            <p>Currency code: {client.currency_code}</p>
                        </div>
                    </div>
                </motion.div>
            ))
            }
        </div>
    );
}

export default Client;
