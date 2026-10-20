-- Houses tabel (Read Only)
create table houses (
    id serial primary key,
    name varchar(50) not null,
    colors varchar(100),
    founder varchar(100)
);

insert into houses (name, colors, founder) values
    ('Gryffindor', 'Scarlet and gold', 'Godric Gryffindor'),
    ('Slytherin', 'Green and silver', 'Salazar Slytherin'),
    ('Ravenclaw', 'Blue and bronze', 'Rowena Ravenclaw'),
    ('Hufflepuff', 'Yellow and black', 'Helga Hufflepuff');


select * from houses;


-- Teachers tabel (Fuld CRUD (Create, Update, Delete))
create table teachers (
    id serial primary key,
    name varchar(100) not null,
    house_id int
);

insert into teachers (name, house_id) values
    ('Severus Snape', 2),
    ('Minerva McGonagall', 1),
    ('Filius Flitwick', 3);

select * from teachers

-- Students tabel (Fuld CRUD (Create, Update, Delete))

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year INT,
    house_id INT
);

INSERT INTO students (name, year, house_id) VALUES
    ('Harry Potter', 3, 1),
    ('Draco Malfoy', 3, 2),
    ('Luna Lovegood', 2, 3),
    ('Cedric Diggory', 5, 4);


-- Courses Tabel

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    teacher_id INT
);

INSERT INTO courses (name, teacher_id) VALUES
    ('Potions', 1),
    ('Transfiguration', 2),
    ('Charms', 3);


-- Students to Courses

CREATE TABLE course_students (
    course_id INT NOT NULL,
    student_id INT NOT NULL,
    PRIMARY KEY (course_id, student_id)
);

INSERT INTO course_students (course_id, student_id) VALUES
    (1, 1),
    (1, 2),
    (2, 1);
