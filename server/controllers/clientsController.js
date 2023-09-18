import { generateAccountNumber, parseNumber } from '../utils/index.js';
import RedisService from '../services/RedisService.js';
import ClientService from '../services/ClientService.js';
import AccountService from '../services/AccountService.js';

let redis;

async function runRedis() {
    await RedisService.createRedisClient();
    redis = RedisService.getRedisClient();
}

runRedis();

export const getAllClients = async (req, res) => {
    const dbClient = await ClientService.connect();

    try {
        const clients = await ClientService.getAllClients(dbClient);

        res.status(200).json({
            clients: clients.rows,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
};

export const getClient = async (req, res) => {
    const dbClient = await ClientService.connect();

    const id = req.params.id;

    try {
        const client = await ClientService.getClient(dbClient, id);

        res.status(200).json({
            client: client.rows,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
};

export const changeAddress = async (req, res) => {
    const dbClient = await ClientService.connect();

    const { client_id,
        street_name,
        house_number,
        postal_code,
    } = req.body;

    try {
        await ClientService.changeClientAddress(dbClient, street_name, house_number, postal_code, client_id)

        res.status(200).json({
            message: 'Client address updated',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
};

export const switchAccount = async (req, res) => {
    const dbClient = await AccountService.connect();

    const { client_id, type_of_customer } = req.body;

    try {
        await AccountService.switchAccount(dbClient, type_of_customer, client_id);

        res.status(200).json({
            message: 'Client account updated',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
}

export const searchByAccountNumber = async (req, res) => {
    const dbClient = await AccountService.connect();

    const { q } = req.query;

    let accountNumber = parseNumber(q)

    try {
        const client = await AccountService.searchByAccountNumber(dbClient, accountNumber);

        res.status(200).json({
            client: client.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
}

export const getAccountNumber = async (req, res) => {
    try {
        let account_number = await generateAccountNumber();

        let checkAccountNumberInCache = await redis.get(account_number);

        if (checkAccountNumberInCache) {
            account_number = await generateAccountNumber();
            return await getAccountNumber();
        }

        await redis.set(account_number, account_number);

        res.status(200).json({
            success: true,
            message: 'Account number generated.',
            accountNumber: account_number,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message })
    }
}

export const createClient = async (req, res) => {
    const dbClient = await ClientService.connect();

    const { type_of_customer, type_of_account } = req.body;

    let card_limit;
    let withdrawal_fee;

    if (type_of_account == 'debit') {
        card_limit = 0;
    } else if (type_of_account == 'credit' && type_of_customer == 'premium') {
        card_limit = 20000;
    } else {
        card_limit = 5000;
    }

    if (type_of_customer == 'premium') {
        withdrawal_fee = 0;
    } else {
        withdrawal_fee = 1;
    }

    try {
        await ClientService.createClient(dbClient, req.body, card_limit, withdrawal_fee);

        res.status(200).json({
            success: true,
            message: 'User Created',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
}

export const showPremiumCustomersByCountry = async (req, res) => {
    const dbClient = await AccountService.connect();

    const { country } = req.query;
    const decodedCountry = decodeURI(country);

    try {
        const data = await AccountService.showPremiumCustomersByCountry(dbClient, decodedCountry);

        res.status(200).json({
            premiumCustomers: [
                {
                    country_name: country,
                    count: Number(data?.rows?.[0]?.count) || 0,
                }
            ]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
};

export const customersToReachCardLimit = async (req, res) => {
    const dbClient = await AccountService.connect();

    try {
        const data = await AccountService.customersToReachCardLimit(dbClient);

        res.status(200).json({
            customersToReachCardLimit: data.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message })
    } finally {
        dbClient.release();
    }
};
