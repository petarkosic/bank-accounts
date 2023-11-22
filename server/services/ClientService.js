import { config } from 'dotenv';
import pool from '../db/db.js';

config();

class ClientService {
    constructor() {
        this.pool = pool;
    }

    async connect() {
        return this.pool.connect();
    }

    async getAllClients(dbClient, page, pageSize) {

        const offset = (page - 1) * pageSize;

        try {
            await dbClient.query('BEGIN');

            let queryString = `
            SELECT clients.client_id, first_name, last_name, date_of_birth, list_of_accounts, type_of_customer, type_of_account, account_number, currency_name, currency_code, deposited_amount FROM clients LEFT JOIN client_address ON clients.client_id = client_address.client_id LEFT JOIN accounts ON accounts.client_id = clients.client_id LEFT JOIN accounts_limit ON accounts.account_id = accounts_limit.account_id LIMIT $1 OFFSET $2;
            `;

            const clients = await dbClient.query(queryString, [pageSize, offset]);

            const countQuery = 'SELECT COUNT(*) FROM clients';
            const countResult = await pool.query(countQuery);
            const totalCount = parseInt(countResult.rows[0].count, 10);

            const nextPage = page * pageSize < totalCount ? parseInt(page, 10) + 1 : null;

            await dbClient.query('COMMIT');

            return { clients, nextPage };

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

    async getClient(dbClient, id) {
        try {
            await dbClient.query('BEGIN');

            let queryString = `
            SELECT clients.client_id, first_name, last_name, date_of_birth, list_of_accounts, country_name, country_code, street_name, house_number, postal_code, type_of_customer, type_of_account, credit_payment, card_limit, withdrawal_fee, accounts.account_id, account_number, currency_name, currency_code, deposited_amount FROM clients LEFT JOIN client_address ON clients.client_id = client_address.client_id LEFT JOIN accounts ON accounts.client_id = clients.client_id LEFT JOIN accounts_limit ON accounts.account_id = accounts_limit.account_id WHERE clients.client_id = $1;
            `;

            const client = await dbClient.query(queryString, [id]);

            await dbClient.query('COMMIT');

            return client;

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

    async createClient(dbClient, reqBody, card_limit, withdrawal_fee) {
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
            credit_payment } = reqBody;

        try {
            await dbClient.query('BEGIN');

            let createClientQuery = `
            INSERT INTO clients (first_name, last_name, date_of_birth) VALUES ($1, $2, $3)
            RETURNING client_id;
            `;
            let createClientDbCall = await dbClient.query(createClientQuery, [first_name, last_name, date_of_birth]);

            let client_id = createClientDbCall?.rows[0]?.client_id;

            let createClientAddressQuery = `
            INSERT INTO client_address (client_id, country_name, country_code, street_name, house_number, postal_code) VALUES ($1, $2, $3, $4, $5, $6);
            `;

            await dbClient.query(createClientAddressQuery, [client_id, country_name, country_code, street_name, house_number, postal_code]);

            let createAccountsQuery = `
            INSERT INTO accounts (client_id, account_number, currency_name, currency_code, deposited_amount) VALUES ($1, $2, $3, $4, $5)
            RETURNING account_id;
            `;
            let createAccountsDbCall = await dbClient.query(createAccountsQuery, [client_id, account_number, currency_name, currency_code, deposited_amount]);

            let account_id = createAccountsDbCall?.rows[0].account_id;

            let createAccountsLimitQuery = `
            INSERT INTO accounts_limit (account_id, type_of_customer, type_of_account, credit_payment, card_limit, withdrawal_fee) VALUES ($1, $2, $3, $4, $5, $6);
            `;

            await dbClient.query(createAccountsLimitQuery, [account_id, type_of_customer, type_of_account, credit_payment, card_limit, withdrawal_fee]);

            await dbClient.query('COMMIT');

            return;
        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

    async changeClientAddress(dbClient, street_name, house_number, postal_code, client_id) {
        try {
            await dbClient.query('BEGIN');

            let queryString = `
            UPDATE client_address
            SET street_name = $1, house_number = $2, postal_code = $3
            WHERE client_address.client_id = $4;
            `;

            const client = await dbClient.query(queryString, [street_name, house_number, postal_code, client_id]);

            await dbClient.query('COMMIT');

            return client;

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

}


export default new ClientService();