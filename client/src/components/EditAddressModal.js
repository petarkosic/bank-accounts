import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { changeAddress } from '../hooks/fetchClients';
import { motion } from 'framer-motion';

export const EditAddressModal = ({ setOpenAddressModal, data }) => {
    const [streetName, setStreetName] = useState(data?.[0].street_name);
    const [houseNumber, setHouseNumber] = useState(data?.[0].house_number);
    const [postalCode, setPostalCode] = useState(data?.[0].postal_code);

    const currentClientId = data?.[0].client_id;

    const navigate = useNavigate();

    const { error, isError, isLoading, mutate } = useMutation(changeAddress);

    const handleChangeAddress = () => {
        const dataToSend = {
            client_id: currentClientId,
            street_name: streetName,
            house_number: houseNumber,
            postal_code: postalCode,
        };

        mutate(dataToSend);
        setOpenAddressModal(false);
        navigate(0);
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error! {error}</div>;
    }

    return (
        <>
            <div className='modal-bg' onClick={() => setOpenAddressModal(false)} />
            <div className='centered'>
                <motion.div
                    className='modal'
                    initial={{ opacity: 0, scaleY: 0, x: -100 }}
                    animate={{ opacity: 1, scaleY: 1, x: 0 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                >
                    <div className="modal-top">
                        <div className='modal-header'>
                            <h5 className='heading'>Change Address</h5>
                        </div>
                        <div className="modal-inputs">
                            <label htmlFor="street-name">Street Name</label>
                            <input
                                type='text'
                                id='street-name'
                                value={streetName}
                                onChange={e => setStreetName(e.target.value)}
                            />
                            <label htmlFor="house-number">House Number</label>
                            <input
                                type='text'
                                value={houseNumber}
                                onChange={e => setHouseNumber(e.target.value)}
                            />
                            <label htmlFor="postal-code">Postal Code</label>
                            <input
                                type='text'
                                value={postalCode}
                                onChange={e => setPostalCode(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="modal-bottom">
                        <div className='modal-content'>
                            Are you sure you want to change the address?
                        </div>
                        <div className='modal-actions'>
                            <div className='actions-container'>
                                <button className='delete-btn' onClick={handleChangeAddress}>
                                    Change
                                </button>
                                <button
                                    className='cancel-btn'
                                    onClick={() => setOpenAddressModal(false)}
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
