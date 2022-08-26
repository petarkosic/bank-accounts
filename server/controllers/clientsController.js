import pool from './../db/db.js'
import { parseNumber } from '../utils/index.js';

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
        SELECT clients.client_id, first_name, last_name, accounts.account_id, account_number, currency_name, currency_code, deposited_amount FROM clients LEFT JOIN accounts ON accounts.client_id = clients.client_id WHERE accounts.account_number = $1;
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

export const createClient = async (req, res, next) => {
    // const client = await pool.connect();

    const { first_name, last_name, date_of_birth, type_of_customer, type_of_account, account_number, currency_name, currency_code, deposited_amount } = req.body;

    try {
        await client.query('BEGIN');



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