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
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result text := '';
  i integer := 0;
BEGIN
  FOR i IN 1..7 LOOP
    result := result || chars[ceil(61 * random())];
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;