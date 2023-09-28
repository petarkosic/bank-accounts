import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchClients } from './../hooks/fetchClients';
import { motion } from 'framer-motion';
import { useSearchClientContext } from '../context/SearchClientContext';

function Clients() {
    const { data, error, isError, isLoading } = useQuery(['clients'], fetchClients, {
        refetchOnWindowFocus: false,
    });

    const { user } = useSearchClientContext();

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
                <p className='hide-on-mobile'>Type Of Account</p>
                <p className='hide-on-mobile'>Type Of Customer</p>
                <p>Balance</p>
                <p className='hide-on-mobile'>Currency Name</p>
                <p>Currency Code</p>
                <div></div>
            </div>
            {user && (
                <div className='clients-client-bg'>
                    {Object.values(user).map(cl => (
                        <motion.div
                            key={cl.client_id}
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            transition={{ duration: .1 }}
                        >
                            <div className='client-name'>
                                <div className="client-fullname">
                                    <h1>{cl.first_name}</h1>
                                    <h2>{cl.last_name}</h2>
                                </div>
                                <p>{cl.account_number}</p>
                                <p className='hide-on-mobile'>{cl.type_of_account}</p>
                                <p className='hide-on-mobile'>{cl.type_of_customer}</p>
                                <p>{cl.deposited_amount?.slice(0, -2)}</p>
                                <p className='hide-on-mobile'>{cl.currency_name}</p>
                                <p>{cl.currency_code}</p>
                                <Link className="button-view-more" to={`/${cl.client_id}`}>View More</Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
            {data?.map(client => (
                <motion.div
                    key={client.client_id}
                    className='clients-client'
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: .1 }}
                >
                    <div className='client-name'>
                        <div className="client-fullname">
                            <h1>{client.first_name}</h1>
                            <h2>{client.last_name}</h2>
                        </div>
                        <p>{client.account_number}</p>
                        <p className='hide-on-mobile'>{client.type_of_account}</p>
                        <p className='hide-on-mobile'>{client.type_of_customer}</p>
                        <p>{client.deposited_amount?.slice(0, -2)}</p>
                        <p className='hide-on-mobile'>{client.currency_name}</p>
                        <p>{client.currency_code}</p>
                        <Link className="button-view-more" to={`/${client.client_id}`}>View More</Link>
                    </div>
                </motion.div>
            ))}
        </div >
    );
}

export default Clients;
