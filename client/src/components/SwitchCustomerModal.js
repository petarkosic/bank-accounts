import React from 'react'
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { switchAccount } from '../hooks/fetchClients';

export const SwitchCustomerModal = ({ setOpenCustomerModal, typeOfCustomer, clientId }) => {

    const customerType = typeOfCustomer;

    const navigate = useNavigate();

    const { mutate } = useMutation(switchAccount);

    const handleSwitchAccount = () => {
        const dataToSend = {
            client_id: Number(clientId),
            type_of_customer: customerType === 'regular' ? 'premium' : 'regular',
        };

        mutate(dataToSend);
        setOpenCustomerModal(false);
        navigate(0);
    }

    return (
        <>
            <div className='modal-bg' onClick={() => setOpenCustomerModal(false)} />
            <div className='centered'>
                <div className='modal'>
                    <div className="modal-top">
                        <div className='modal-header'>
                            <h5 className='heading'>Switch Account</h5>
                        </div>
                        <div className="modal-inputs">
                            <span>Current Account</span>
                            <p>{customerType}</p>
                            <span>Switch to</span>
                            <p>{customerType === 'regular' ? 'premium' : 'regular'}</p>
                        </div>
                    </div>
                    <div className="modal-bottom">
                        <div className='modal-content'>
                            Are you sure you want to switch the account?
                        </div>
                        <div className='modal-actions'>
                            <div className='actions-container'>
                                <button className='delete-btn' onClick={handleSwitchAccount}>
                                    Change
                                </button>
                                <button
                                    className='cancel-btn'
                                    onClick={() => setOpenCustomerModal(false)}
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
