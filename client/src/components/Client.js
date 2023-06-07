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

    const handleShowInput = e => {
        depositWithdrawButtonRef.current.style.display = 'none'
        depositWithdrawInputRef.current.style.display = 'block'
        depositWithdrawSubmitButton.current.style.display = 'block'
    }

    const { mutate } = useMutation(depositOrWithdraw);

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSend = {
            client_id: clientId,
            deposited_amount: Number(data?.[0].deposited_amount) + Number(changeAmount)
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
                    className='client-card'
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: .1 }}
                >
                    <div className='client-info'>
                        <div className="client-fullname">
                            <h1>{client.first_name}{' '}{client.last_name}</h1>
                            <span className={typeOfCustomer}></span>
                        </div>
                        <p className='account-number'>{client.account_number}</p>
                        <div className="type">
                            <p>{client.type_of_account}</p>
                            <p>{client.type_of_customer}</p>
                            <button className="button-switch" onClick={() => setOpenCustomerModal(true)}>Switch to {typeOfCustomer === 'premium' ? 'regular' : 'premium'}</button>
                            {openCustomerModal &&
                                <SwitchCustomerModal
                                    setOpenCustomerModal={setOpenCustomerModal}
                                    typeOfCustomer={typeOfCustomer}
                                    clientId={clientId}
                                />
                            }
                        </div>
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
                            <p>Deposited amount: {client.deposited_amount?.slice(0, -2)}</p>
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
                                    style={{ display: 'none' }}
                                    placeholder='Amount' />
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
                </motion.div>
            ))
            }
        </div>
    );
}

export default Client;
