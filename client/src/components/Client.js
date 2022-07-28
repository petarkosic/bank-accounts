import { useQuery } from '@tanstack/react-query';
import { fetchClient } from './../hooks/fetchClients';
import { useState } from 'react';

function Client() {
    const [clientId, setClientId] = useState(1);

    const { data, error, isError, isLoading } = useQuery(['client', clientId], () => fetchClient(clientId));

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error! {error}</div>;
    }

    return (
        <div>
            {data?.map(cl => (
                <div key={cl.client_id}>
                    <h1>{cl.first_name}</h1>
                    <h2>{cl.last_name}</h2>
                </div>
            ))
            }
        </div >
    );
}

export default Client;
