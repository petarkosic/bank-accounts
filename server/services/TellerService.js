import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import pool from '../db/db.js';

config();

const jwt = jsonwebtoken;

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
            const emailExists = emailCheckResult?.rows[0].length > 0;

            if (emailExists) {
                await dbClient.query('ROLLBACK');
                return { error: 'Email already exists' };
            }

            const queryString = `
                INSERT INTO tellers (login_id, first_name, last_name, email, password)
                VALUES (generate_login_id(), $1, $2, $3, $4)
                RETURNING login_id
            `;

            let result = await dbClient.query(queryString, [first_name, last_name, email, hashedPassword])

            await dbClient.query('COMMIT');

            return {
                message: 'Teller Created',
                login_id: result.rows[0].login_id
            };

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

    async login(dbClient, login_id, password) {
        try {
            await dbClient.query('BEGIN');

            const queryString = `SELECT teller_id, login_id, first_name, last_name, email, password, registered_at FROM tellers WHERE login_id = $1;`;

            const user = await dbClient.query(queryString, [login_id]);

            if (user.rows.length === 0) {
                return { message: 'Invalid Credentials' };
            }

            const validPassword = await bcrypt.compare(
                password,
                user.rows[0].password
            );

            if (!validPassword) {
                return { message: 'Invalid Credentials' };
            }

            const { login_id: loginID, first_name, last_name, email } = user.rows[0];

            await dbClient.query('COMMIT');

            const accessToken = generateAccessToken(user.rows[0]);

            return {
                login_id: loginID,
                first_name,
                last_name,
                email,
                accessToken,
                message: 'Login Successful',
            }

        } catch (error) {
            await dbClient.query('ROLLBACK');
            console.log(error.message);
            throw new Error('Server error')
        }
    }

    async logout(dbClient) {
        // TODO
    }
}


export default new TellerService();

function generateAccessToken(user) {
    return jwt.sign(
        { userId: user.user_id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1h',
        }
    );
}

