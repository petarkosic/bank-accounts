import pool from './../db/db.js'

export const getAllClients = async (req, res, next) => {

    try {
        let query = `
        SELECT clients.client_id, first_name, last_name, date_of_birth, list_of_accounts, country_name, country_code, street_name, house_number, postal_code, type_of_customer FROM clients LEFT JOIN client_address ON clients.client_id = client_address.client_id LEFT JOIN client_accounts_limit ON clients.client_id = client_accounts_limit.client_id; 
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
        let client = await pool.query('SELECT * FROM clients WHERE client_id = $1', [id]);

        res.status(200).json({
            client: client.rows,
        });
    } catch (err) {
        console.error(err.message);
    }
};

export const changeAddress = async (req, res, next) => {
    const id = req.params.id;

    try {
        let query = `
        UPDATE client_address
        SET street_name = 'BLABLABLA', house_number = '142', postal_code = '412'
        FROM clients
        WHERE clients.client_id = 2 AND client_address.client_id = clients.client_id;
        `;

        // let client = await pool.query('SELECT * FROM clients WHERE client_id = $1', [id]);

        res.status(200).json({
            client: client.rows,
        });
    } catch (err) {
        console.error(err.message);
    }
};
