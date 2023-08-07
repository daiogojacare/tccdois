CREATE DATABASE meubanco;

use meubanco;

CREATE TABLE users(
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR (100) NOT NULL,
    email VARCHAR (100) NOT NULL,
    localizacao VARCHAR (100) NOT NULL,
    pass VARCHAR (100) NOT NULL
    /*pass INTEGER NOT NULL*/

);
