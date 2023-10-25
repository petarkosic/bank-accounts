\c bank_accounts;

CREATE TABLE tellers(
    teller_id SERIAL,
    login_id VARCHAR(7) NOT NULL UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (teller_id)
);

CREATE OR REPLACE FUNCTION generate_login_id()
RETURNS VARCHAR(7) AS $$
DECLARE
    characters VARCHAR(62) := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(7) := '';
    i INT;
BEGIN
    FOR i IN 1..7 LOOP
        result := result || substr(characters, (gen_random_bytes(1)::int % 62) + 1, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
