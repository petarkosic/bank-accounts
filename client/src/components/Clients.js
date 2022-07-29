import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchClients } from './../hooks/fetchClients';

function Clients() {
    const { data, error, isError, isLoading } = useQuery(['clients'], fetchClients);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error! {error}</div>;
    }

    return (
        <div className='clients'>
            <div className="clients-heading">
                <p>Client Name</p>
                <p>Account Number</p>
                <p>Type Of Account</p>
                <p>Type Of Customer</p>
                <p>Deposited Amount</p>
                <p>Currency Name</p>
                <p>Currency Code</p>
                <div></div>
            </div>
            {data?.map(client => (
                <div key={client.client_id} className='clients-client'>
                    <div className='client-name'>
                        <div className="client-fullname">
                            <h1>{client.first_name}</h1>
                            <h2>{client.last_name}</h2>
                        </div>
                        <p>{client.account_number}</p>
                        <p>{client.type_of_account}</p>
                        <p>{client.type_of_customer}</p>
                        <p>{client.deposited_amount.slice(0, -2)}</p>
                        <p>{client.currency_name}</p>
                        <p>{client.currency_code}</p>
                        <Link to={`/${client.client_id}`}>View More</Link>
                    </div>
                </div>
            ))
            }
        </div>
    );
}

export default Clients;