import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import pool from '../db/db.js';

config();

class TellerService {
    constructor() {
        this.pool = pool;
    }

    async connect() {
        return this.pool.connect();
    }

    async createTeller(dbClient, reqBody) {
        const { first_name, last_name, email, password } = reqBody;
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            await dbClient.query('BEGIN');

            const emailCheckQuery = 'SELECT COUNT(*) FROM tellers WHERE email = $1';
            const emailCheckResult = await dbClient.query(emailCheckQuery, [email]);
            const emailExists = emailCheckResult?.rows[0].lenght > 0;

            if (emailExists) {
                await dbClient.query('ROLLBACK');
                return { error: 'Email already exists' };
            }

            const queryString = `
                INSERT INTO tellers (login_id, first_name, last_name, email, password)
                VALUES (generate_login_id(), $1, $2, $3, $4)
            `;

            await dbClient.query(queryString, [first_name, last_name, email, hashedPassword])

            await dbClient.query('COMMIT');

            return { message: 'Teller Created' };

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

    async login(dbClient, login_id, password) {
        // TODO
    }

    async logout(dbClient) {
        // TODO
    }
}


export default new TellerService();

