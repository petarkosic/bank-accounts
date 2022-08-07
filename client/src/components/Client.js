import { useQuery } from '@tanstack/react-query';
import { fetchClient } from './../hooks/fetchClients';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { EditAddressModal } from './EditAddressModal';
import { SwitchCustomerModal } from './SwitchCustomerModal';

function Client() {
    const [openModal, setOpenModal] = useState(false);
    const [openCustomerModal, setOpenCustomerModal] = useState(false);
    const [typeOfCustomer, setTypeOfCustomer] = useState();

    const { clientId } = useParams();
    const navigate = useNavigate();

    const { data, error, isError, isLoading } = useQuery(['client', clientId], () => fetchClient(clientId), {
        onSuccess: (type) => {
            setTypeOfCustomer(type?.[0].type_of_customer)
        }
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error! {error}</div>;
    }

    return (
        <div className='client'>
            <button className="button-go-back" onClick={() => navigate(-1)}>Go Back</button>
            {data?.map(client => (
                <div key={client.client_id} className='client-card'>
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
                            <button className="address-button" onClick={() => setOpenModal(true)}>Change Address</button>
                            {openModal &&
                                <EditAddressModal
                                    setOpenModal={setOpenModal}
                                    data={data}
                                />}
                        </div>
                    </div>
                    <div className="client-money">
                        <p>Card limit: {client.card_limit}</p>
                        <p>Credit payment: {client.credit_payment}</p>
                        <p>Deposited amount: {client.deposited_amount.slice(0, -2)}</p>
                        <p>Currency name: {client.currency_name}</p>
                        <p>Currency code: {client.currency_code}</p>
                    </div>
                </div>
            ))
            }
        </div>
    );
}

export default Client;
