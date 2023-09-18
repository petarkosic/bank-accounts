import { config } from 'dotenv';
import pool from '../db/db.js';

config();

class MoneyTransferService {
    constructor() {
        this.pool = pool;
    }

    async connect() {
        return this.pool.connect();
    }

    async depositOrWithdraw(dbClient, deposited_amount, client_id) {
        try {
            if (deposited_amount < 0) {
                return 'Cannot withdraw more than deposited';
            }

            await dbClient.query('BEGIN');

            let queryString = `
            UPDATE accounts
            SET deposited_amount = $1
            WHERE client_id = $2
            `;

            await dbClient.query(queryString, [deposited_amount, client_id]);

            await dbClient.query('COMMIT');

            return;

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

    async sendMoney(dbClient, from, to, amount) {
        try {
            await dbClient.query('BEGIN');

            let fromQuery = `
            UPDATE accounts
            SET deposited_amount = deposited_amount - $1
            WHERE client_id = $2;
            `;

            await dbClient.query(fromQuery, [Number(amount), from]);

            let toQuery = `
            UPDATE accounts
            SET deposited_amount = deposited_amount + $1
            WHERE client_id = $2;
            `;

            await dbClient.query(toQuery, [Number(amount), to]);

            await dbClient.query('COMMIT');

            return;

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

}


export default new MoneyTransferService();