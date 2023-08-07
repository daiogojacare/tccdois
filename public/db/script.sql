CREATE DATABASE meubanco;

use meubanco;

CREATE TABLE usuarios(
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
    usuarionome VARCHAR (100) NOT NULL,
    email VARCHAR (100) NOT NULL,
    localizacao VARCHAR (100) NOT NULL,
    senha VARCHAR (100) NOT NULL
    /*pass INTEGER NOT NULL*/
);

CREATE TABLE produtos(
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
    protudonome VARCHAR (100) NOT NULL,
    preco VARCHAR (100) NOT NULL,
    quantidade INTEGER NOT NULL,
);


