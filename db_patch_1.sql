-- patch 1

-- adding full name and removing first and last name
ALTER TABLE students 
ADD COLUMN full_name VARCHAR(200);


UPDATE students 
SET full_name = CONCAT_WS(' ', first_name, NULLIF(last_name, ''));

ALTER TABLE students 
DROP COLUMN first_name,
DROP COLUMN last_name;

ALTER TABLE students
ALTER COLUMN "full_name"
SET NOT NULL;



-- adding specialization table and its reference to the student table using foreign key
CREATE TABLE specializations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO specializations (name) VALUES
('Automobile Engineering'),
('Basic CSE'),
('Basic ECOM'),
('Basic Mechanical'),
('Cyber Security'),
('Data Science And Artificial Intelligence'),
('VLSI Design');

ALTER TABLE students
ADD COLUMN specialization_id INT REFERENCES specializations(id);


-- adding more requirted column to the students table
ALTER TABLE students
ADD COLUMN father_name VARCHAR(150),
ADD COLUMN father_mobile VARCHAR(15),
ADD COLUMN father_email VARCHAR(255),
ADD COLUMN mother_name VARCHAR(150),
ADD COLUMN mother_mobile VARCHAR(15),
ADD COLUMN aadhar_number VARCHAR(12),
ADD COLUMN pan_number VARCHAR(10),
ADD COLUMN domicile_state VARCHAR(100),
ADD COLUMN board_10_name VARCHAR(150),
ADD COLUMN board_10_passing_year INT,
ADD COLUMN board_12_name VARCHAR(150),
ADD COLUMN board_12_passing_year INT;


ALTER TYPE specialization_enum RENAME VALUE 'ECE' TO 'E.Com';

UPDATE students SET branch = 'E.Com' WHERE branch = 'ECE';

ALTER TABLE students
ALTER COLUMN branch TYPE specialization_enum
USING branch::specialization_enum;