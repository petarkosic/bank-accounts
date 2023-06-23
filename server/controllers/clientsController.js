import pool from './../db/db.js'
import { generateAccountNumber, parseNumber } from '../utils/index.js';
import { createRedisClient, getRedisClient } from './../services/redisService.js'

let redis;
async function runRedis() {
    await createRedisClient();
    redis = await getRedisClient()
}
runRedis();

export const getAllClients = async (req, res, next) => {

    try {
        let query = `
        SELECT clients.client_id, first_name, last_name, date_of_birth, list_of_accounts, type_of_customer, type_of_account, account_number, currency_name, currency_code, deposited_amount FROM clients LEFT JOIN client_address ON clients.client_id = client_address.client_id LEFT JOIN accounts ON accounts.client_id = clients.client_id LEFT JOIN accounts_limit ON accounts.account_id = accounts_limit.account_id;
        `;

        let clients = await pool.query(query);

        res.status(200).json({
            clients: clients.rows,
        });
    } catch (err) {
        console.error(err.message);
    }
};

export const getClient = async (req, res, next) => {
    const id = req.params.id;

    try {
        let query = `
        SELECT clients.client_id, first_name, last_name, date_of_birth, list_of_accounts, country_name, country_code, street_name, house_number, postal_code, type_of_customer, type_of_account, credit_payment, card_limit, withdrawal_fee, accounts.account_id, account_number, currency_name, currency_code, deposited_amount FROM clients LEFT JOIN client_address ON clients.client_id = client_address.client_id LEFT JOIN accounts ON accounts.client_id = clients.client_id LEFT JOIN accounts_limit ON accounts.account_id = accounts_limit.account_id WHERE clients.client_id = $1;
        `;

        let client = await pool.query(query, [id]);

        res.status(200).json({
            client: client.rows,
        });
    } catch (err) {
        console.error(err.message);
    }
};

export const changeAddress = async (req, res, next) => {
    const { client_id,
        street_name,
        house_number,
        postal_code,
    } = req.body;

    try {
        let query = `
        UPDATE client_address
        SET street_name = $1, house_number = $2, postal_code = $3
        WHERE client_address.client_id = $4;
        `;

        let client = await pool.query(query, [street_name, house_number, postal_code, client_id]);

        res.status(200).json({
            client: client.rows[0],
        });
    } catch (err) {
        console.error(err);
    }
};

export const switchAccount = async (req, res, next) => {
    const { client_id, type_of_customer } = req.body;

    try {
        let query = `
        UPDATE accounts_limit
        SET type_of_customer = $1
        WHERE accounts_limit.account_id = (SELECT account_id FROM accounts WHERE accounts.client_id = $2);
        `;

        let client = await pool.query(query, [type_of_customer, client_id]);

        res.status(200).json({
            client: client.rows[0],
        });
    } catch (err) {
        console.error(err);
    }
}

export const depositOrWithdraw = async (req, res, next) => {
    const { client_id, deposited_amount } = req.body;

    try {
        if (deposited_amount > 0) {
            let query = `
            UPDATE accounts
            SET deposited_amount = $1
            WHERE client_id = $2
            `;

            let client = await pool.query(query, [deposited_amount, client_id]);

            res.status(200).json({
                client: client.rows[0],
            });
        }
    } catch (err) {
        console.error(err);
    }
}

export const searchByAccountNumber = async (req, res, next) => {
    const { q } = req.query;

    let accountNumber = parseNumber(q)

    try {
        let query = `
        SELECT clients.client_id, first_name, last_name, accounts.account_id, account_number, currency_name, currency_code, deposited_amount, type_of_customer, type_of_account FROM clients LEFT JOIN accounts ON accounts.client_id = clients.client_id LEFT JOIN accounts_limit ON accounts.account_id = accounts_limit.account_id WHERE accounts.account_number = $1;
        `

        let client = await pool.query(query, [accountNumber]);

        res.status(200).json({
            client: client.rows[0],
        });
    } catch (err) {
        console.error(err);
    }
}

export const sendMoney = async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { from, to, amount } = req.body;

        let fromQuery = `
        UPDATE accounts
        SET deposited_amount = deposited_amount - $1
        WHERE client_id = $2;
        `;

        let clientFromQuery = await client.query(fromQuery, [Number(amount), from]);

        let toQuery = `
        UPDATE accounts
        SET deposited_amount = deposited_amount + $1
        WHERE client_id = $2;
        `;

        let clientToQuery = await client.query(toQuery, [Number(amount), to]);

        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            message: 'Accounts Updated',
        });
    } catch (err) {
        await client.query('ROLLBACK');

        console.error(err);
    } finally {
        client.release();
    }
}

export const updateCardLimitAndWithdrawalFee = async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        let updateCardLimit = `
        UPDATE accounts_limit
        SET card_limit = 
        CASE WHEN type_of_account = 'debit' THEN 0 WHEN type_of_account = 'credit' AND type_of_customer = 'regular' THEN 5000 WHEN type_of_account = 'credit' AND type_of_customer = 'premium' THEN 20000 END;
        `;

        let clientFromQuery = await client.query(updateCardLimit);

        let updateWithdrawalFee = `
        UPDATE accounts_limit
        SET withdrawal_fee = CASE WHEN type_of_customer = 'regular' THEN 1 WHEN type_of_customer = 'premium' THEN 0 END;
        `;

        let clientToQuery = await client.query(updateWithdrawalFee);

        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            message: 'Card Limit and Withdrawal Fee Updated',
        });
    } catch (err) {
        await client.query('ROLLBACK');

        console.error(err);
    } finally {
        client.release();
    }
}

export const getAccountNumber = async (req, res, next) => {
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
    }
}

export const createClient = async (req, res, next) => {
    const client = await pool.connect();

    const { first_name,
        last_name,
        date_of_birth,
        country_name,
        country_code,
        street_name,
        house_number,
        postal_code,
        account_number,
        currency_name,
        currency_code,
        deposited_amount,
        type_of_customer,
        type_of_account,
        credit_payment } = req.body;

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
        await client.query('BEGIN');

        // check if acc number is in the database
        // let isAccountNumberInDatabase = `
        // SELECT * FROM accounts WHERE account_number = $1;
        // `;

        // let createAccountNumberDatabaseCall = await client.query(isAccountNumberInDatabase, [account_number]);

        // if (createAccountNumberDatabaseCall.rows.length > 0) {
        //     res.status(400).json({
        //         success: false,
        //         message: 'Account number already exists',
        //     })
        // }
        // if it is, generate a new one
        // else, use the existing one

        let createClientQuery = `
        INSERT INTO clients (first_name, last_name, date_of_birth) VALUES ($1, $2, $3)
        RETURNING client_id;
        `;
        let createClientDbCall = await client.query(createClientQuery, [first_name, last_name, date_of_birth]);

        let client_id = createClientDbCall?.rows[0]?.client_id;

        let createClientAddressQuery = `
        INSERT INTO client_address (client_id, country_name, country_code, street_name, house_number, postal_code) VALUES ($1, $2, $3, $4, $5, $6);
        `;
        let createClientAddressDbCall = await client.query(createClientAddressQuery, [client_id, country_name, country_code, street_name, house_number, postal_code]);

        let createAccountsQuery = `
        INSERT INTO accounts (client_id, account_number, currency_name, currency_code, deposited_amount) VALUES ($1, $2, $3, $4, $5)
        RETURNING account_id;
        `;
        let createAccountsDbCall = await client.query(createAccountsQuery, [client_id, account_number, currency_name, currency_code, deposited_amount]);

        let account_id = createAccountsDbCall?.rows[0].account_id;

        let createAccountsLimitQuery = `
        INSERT INTO accounts_limit (account_id, type_of_customer, type_of_account, credit_payment, card_limit, withdrawal_fee) VALUES ($1, $2, $3, $4, $5, $6);
        `;
        let createAccountsLimitDbCall = await client.query(createAccountsLimitQuery, [account_id, type_of_customer, type_of_account, credit_payment, card_limit, withdrawal_fee]);


        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            message: 'User Created',
        });
    } catch (err) {
        await client.query('ROLLBACK');

        console.error(err);
    } finally {
        client.release();
    }
}

export const showPremiumCustomersByCountry = async (req, res, next) => {
    const client = await pool.connect();

    const { country } = req.query;
    const decodedCountry = decodeURI(country);

    try {
        await client.query('BEGIN');

        let query = `
        SELECT ca.country_name, COUNT(c.client_id)
        FROM clients c
        LEFT JOIN client_address ca 
        ON c.client_id = ca.client_id 
        LEFT JOIN accounts a 
        ON a.client_id = c.client_id 
        LEFT JOIN accounts_limit al 
        ON a.account_id = al.account_id
        WHERE al.type_of_customer = 'premium' AND ca.country_name = $1
        GROUP BY ca.country_name;
        `;

        let data = await pool.query(query, [decodedCountry]);

        await client.query('COMMIT');

        if (data.rows.length == 0) {
            res.status(200).json({
                premiumCustomers: [
                    {
                        country_name: country,
                        count: 0,
                    },
                ]
            });
        }

        res.status(200).json({
            premiumCustomers: [
                {
                    country_name: country,
                    count: Number(data.rows[0].count),
                }
            ]
        });
    } catch (err) {
        await client.query('ROLLBACK');

        console.error(err.message);
    } finally {
        client.release();
    }
};

export const customersToReachCardLimit = async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // if database supports clients with single accounts only
        let query = `
        SELECT c.client_id, c.first_name, c.last_name, al.card_limit, a.deposited_amount, a.account_number, a.currency_name
        FROM clients c
        JOIN accounts a ON c.client_id = a.client_id
        JOIN accounts_limit al ON a.account_id = al.account_id
        WHERE a.deposited_amount >= al.card_limit * 0.9;
        `;

        // if database supports clients with multiple accounts
        // let query = `
        // SELECT c.client_id, c.first_name, c.last_name, al.card_limit, SUM(a.deposited_amount) AS total_deposited_amount
        // FROM clients c
        // JOIN accounts a ON c.client_id = a.client_id
        // JOIN accounts_limit al ON a.account_id = al.account_id
        // GROUP BY c.client_id, c.first_name, c.last_name, al.card_limit
        // HAVING SUM(a.deposited_amount) >= al.card_limit * 0.9;
        // `;
        let data = await pool.query(query);

        await client.query('COMMIT');

        res.status(200).json({
            customersToReachCardLimit: data.rows
        });
    } catch (err) {
        await client.query('ROLLBACK');

        console.error(err.message);
    } finally {
        client.release();
    }
};


