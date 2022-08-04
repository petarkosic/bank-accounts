import React, { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query';
import { changeAddress } from '../hooks/fetchClients';

// export const EditAddressModal = ({ setOpenModal, streetName, houseNumber, setStreetName, setHouseNumber }) => {
export const EditAddressModal = ({ setOpenModal, data }) => {
    const [currentClientId, setCurrentClientId] = useState(data?.[0].client_id);
    const [streetName, setStreetName] = useState(data?.[0].street_name);
    const [houseNumber, setHouseNumber] = useState(data?.[0].house_number);
    const [postalCode, setPostalCode] = useState(data?.[0].postal_code);
    const [typeOfCustomer, setTypeOfCustomer] = useState(data?.[0].type_of_customer);

    // const { data: changeAddressData, error, isError, isLoading } = useQuery(['client', currentClientId], () => changeAddress(currentClientId, {
    //     currentClientId,
    //     streetName,
    //     houseNumber,
    //     postalCode,
    // }));

    // const { data: changeAddressData, error, isError, isLoading, mutate } = useMutation(changeAddress, {
    //     onSuccess: () => {
    //         navigate(`/`)
    //     }
    // });

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error! {error}</div>;
    }

    return (
        <>
            <div className='modal-bg' onClick={() => setOpenModal(false)} />
            <div className='centered'>
                <div className='modal'>
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
                                <button className='delete-btn' onClick={() => setOpenModal(false)}>
                                    Change
                                </button>
                                <button
                                    className='cancel-btn'
                                    onClick={() => setOpenModal(false)}
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
