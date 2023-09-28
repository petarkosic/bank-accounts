import { config } from 'dotenv';
import pool from '../db/db.js';

config();

class AccountService {
    constructor() {
        this.pool = pool;
    }

    async connect() {
        return this.pool.connect();
    }

    async switchAccount(dbClient, type_of_customer, client_id) {
        try {
            await dbClient.query('BEGIN');

            let queryString = `
            UPDATE accounts_limit
            SET type_of_customer = $1
            WHERE accounts_limit.account_id = (SELECT account_id FROM accounts WHERE accounts.client_id = $2);
            `;

            const client = await dbClient.query(queryString, [type_of_customer, client_id]);

            await dbClient.query('COMMIT');

            return client;

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

    async searchByAccountNumber(dbClient, accountNumber) {
        try {
            await dbClient.query('BEGIN');

            const queryString = `
            SELECT clients.client_id, first_name, last_name, accounts.account_id, account_number, currency_name, currency_code, deposited_amount, type_of_customer, type_of_account FROM clients LEFT JOIN accounts ON accounts.client_id = clients.client_id LEFT JOIN accounts_limit ON accounts.account_id = accounts_limit.account_id WHERE accounts.account_number = $1;
            `;

            const client = await dbClient.query(queryString, [accountNumber]);

            await dbClient.query('COMMIT');

            return client;

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

    async showPremiumCustomersByCountry(dbClient, country) {
        try {
            await dbClient.query('BEGIN');

            let queryString = `
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

            const data = await dbClient.query(queryString, [country]);

            await dbClient.query('COMMIT');

            return data;

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

    async customersToReachCardLimit(dbClient) {
        try {
            await dbClient.query('BEGIN');

            // if database supports clients with single accounts only
            let quertString = `
            SELECT 
                c.client_id AS client_id,
                c.first_name AS first_name,
                c.last_name AS last_name,
                al.card_limit AS card_limit,
                al.type_of_customer AS type_of_customer,
                a.deposited_amount AS deposited_amount,
                a.account_number AS account_number,
                a.currency_name AS currency_name,
                (al.card_limit - a.deposited_amount) AS remaining_credit
            FROM 
                clients c
            JOIN 
                accounts a ON c.client_id = a.client_id
            JOIN 
                accounts_limit al ON a.account_id = al.account_id
            WHERE 
                a.deposited_amount >= al.card_limit * 0.9 AND
                a.deposited_amount < al.card_limit;`;

            const data = await dbClient.query(quertString);

            await dbClient.query('COMMIT');

            return data;

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }
}

export default new AccountService();