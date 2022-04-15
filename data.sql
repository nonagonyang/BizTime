\c biztime
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS companies_industries CASCADE;

CREATE TABLE companies (
    company_code text PRIMARY KEY,
    company_name text NOT NULL UNIQUE,
    company_description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    company_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
    industry_code text PRIMARY KEY,
    industry text NOT NULL UNIQUE
);

CREATE TABLE companies_industries (
    company_code TEXT NOT NULL REFERENCES companies,
    industry_code TEXT NOT NULL REFERENCES industries,
    PRIMARY KEY(company_code, industry_code)
);


INSERT INTO companies(company_code,company_name,company_description)
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('coinbase','Coinbase Company','crypto currency related stuff');

INSERT INTO invoices (company_code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries(industry_code,industry)
  VALUES('tech','Technology'),
        ('fin','Finance');

INSERT INTO companies_industries(company_code,industry_code)
  VALUES('apple','tech'),
        ('ibm','tech'),
        ('coinbase','tech'),
        ('coinbase','fin')
