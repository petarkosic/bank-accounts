CREATE DATABASE bank_accounts;


CREATE TYPE type_of_customer AS ENUM ('regular', 'premium');
CREATE TYPE type_of_account AS ENUM ('credit', 'debit');
CREATE TYPE credit_payment_type AS ENUM ('monthly', 'quarterly', 'yearly');

CREATE TABLE clients (
    client_id SERIAL, 
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    list_of_accounts text[],
    PRIMARY KEY (client_id)
);

-- INSERT INTO clients (client_id, first_name, last_name, date_of_birth, list_of_accounts) VALUES (1, 'John', 'Doe', '1996-12-01', '{123, 456, 789}');

CREATE TABLE client_address (
    client_address_id SERIAL,
    client_id SERIAL,
    country_name VARCHAR(255) NOT NULL,
    country_code VARCHAR(255) NOT NULL,
    street_name VARCHAR(255) NOT NULL,
    house_number VARCHAR(30) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    PRIMARY KEY (client_address_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- INSERT INTO client_address (client_id, country_name, country_code, street_name, house_number, postal_code) VALUES (1, 'Serbia', 'SRB', 'Blablabla', '90', '11000');

CREATE TABLE accounts (
    account_id SERIAL,
    client_id SERIAL,
    account_number VARCHAR(10) NOT NULL CHECK(account_number ~ '^\d{3}-\d{3}-\d{2}$'),
    currency_name VARCHAR(50) NOT NULL,
    currency_code VARCHAR(5) NOT NULL,
    deposited_amount NUMERIC(20, 4) NOT NULL DEFAULT 0,
    PRIMARY KEY (account_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- INSERT INTO accounts (account_id, client_id, account_number, currency_name, currency_code, deposited_amount) VALUES (1, 1, '412-142-23', 'dinar', 'RSD', 1200);

CREATE TABLE accounts_limit (
    accounts_limit_id SERIAL, 
    account_id SERIAL,
    type_of_customer type_of_customer NOT NULL DEFAULT 'regular',
    type_of_account type_of_account NOT NULL DEFAULT 'credit',
    credit_payment credit_payment_type NOT NULL,
    card_limit INTEGER NOT NULL DEFAULT 5000,
    withdrawal_fee INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (accounts_limit_id),
    FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);

-- INSERT INTO accounts_limit (account_id, type_of_customer, type_of_account, credit_payment) VALUES (1, 'premium', 'credit', 'yearly');

UPDATE accounts_limit
SET card_limit = 
CASE WHEN type_of_account = 'debit' THEN 0 WHEN type_of_account = 'credit' AND type_of_customer = 'regular' THEN 5000 WHEN type_of_account = 'credit' AND type_of_customer = 'premium' THEN 20000 END;

UPDATE accounts_limit
SET withdrawal_fee = CASE WHEN type_of_customer = 'regular' THEN 1 WHEN type_of_customer = 'premium' THEN 0 END;

CREATE OR REPLACE FUNCTION update_card_limit() 
    RETURNS TRIGGER AS $$
BEGIN
    CASE
        WHEN OLD.type_of_account = 'debit' THEN 
            NEW.card_limit := 0;
        WHEN OLD.type_of_account = 'credit' AND NEW.type_of_customer = 'regular' THEN 
            NEW.card_limit := 5000;
        WHEN OLD.type_of_account = 'credit' AND NEW.type_of_customer = 'premium' THEN 
            NEW.card_limit := 20000;
    END CASE;
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER trigger_update_card_limit
    BEFORE UPDATE ON accounts_limit
    FOR EACH ROW
    EXECUTE FUNCTION update_card_limit();



CREATE OR REPLACE FUNCTION update_withdrawal_fee() 
    RETURNS TRIGGER AS $$
BEGIN
    CASE
        WHEN NEW.type_of_customer = 'regular' THEN 
            NEW.withdrawal_fee := 1;
        WHEN NEW.type_of_customer = 'premium' THEN 
            NEW.withdrawal_fee := 0;
    END CASE;
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER trigger_update_withdrawal_fee
    BEFORE UPDATE ON accounts_limit
    FOR EACH ROW
    EXECUTE FUNCTION update_withdrawal_fee();