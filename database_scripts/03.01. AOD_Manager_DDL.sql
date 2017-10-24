-------------------------------------
-- AOD MANAGER DATABASE DEFINITION --
-------------------------------------

-- TABLE DROPS --
-----------------
-- DROP TABLE manager.STATIC_CONTENTS_TRANSLATIONS;
-- DROP TABLE manager.SECTIONS_TRANSLATIONS;
-- DROP TABLE manager.USERS_APPLICATIONS_PERMISSIONS;
-- DROP TABLE manager.USERS_ROLES;
-- DROP TABLE manager.STATIC_CONTENTS;
-- DROP TABLE manager.SECTIONS;
-- DROP TABLE manager.APPLICATIONS;
-- DROP TABLE manager.USERS;
-- DROP TABLE manager.ROLES;
-- DROP TABLE manager.LICENSES;
-- DROP TABLE manager.LANGUAGES;

-- TABLE CREATES -- 
-------------------
-- TABLE LANGUAGES
CREATE TABLE manager.LANGUAGES (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	name					VARCHAR(20)		NOT NULL,
	locale					VARCHAR(10)		NOT NULL
);

-- TABLE LICENSES
CREATE TABLE manager.LICENSES (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	name					VARCHAR(100)	NOT NULL,
	description				TEXT			NULL
);

-- TABLE ROLES
CREATE TABLE manager.ROLES (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	name					VARCHAR(20)		NOT NULL,
	description				TEXT			NULL,
	active 					BOOLEAN			NOT NULL 	DEFAULT TRUE
);

-- TABLE USERS
CREATE TABLE manager.USERS (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	name					VARCHAR(100)	NOT NULL,
	password				TEXT			NOT NULL,
	email					VARCHAR(80)		NOT NULL,
	description				TEXT			NULL,
	active 					BOOLEAN			NOT NULL 	DEFAULT TRUE,
	creation_date			TIMESTAMP		NOT NULL	DEFAULT NOW(),
	last_edition_date		TIMESTAMP		NOT NULL	DEFAULT NOW(),
	token_restore			VARCHAR(50)		NULL,
	token_expiration_date	TIMESTAMP		NULL
);

-- TABLE APPLICATIONS
CREATE TABLE manager.APPLICATIONS (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	appplication_name		VARCHAR(100)	NOT NULL,
	description				TEXT			NULL,
	active 					BOOLEAN			NOT NULL 	DEFAULT TRUE
);

-- TABLE SECTIONS
CREATE TABLE manager.SECTIONS (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	title					TEXT			NOT NULL,
	subtitle				TEXT			NULL,
	description				TEXT			NULL
);

-- TABLE STATIC_CONTENTS
CREATE TABLE manager.STATIC_CONTENTS (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	id_section				INTEGER			NOT NULL 	REFERENCES manager.SECTIONS(id),
	title					TEXT			NULL,
	content					TEXT			NULL,
	content_order			INTEGER			NOT NULL,
	target_url				TEXT			NULL,
	visible					BOOLEAN			NOT NULL	DEFAULT TRUE
);

-- TABLE USERS_ROLES
CREATE TABLE manager.USERS_ROLES (
	id_user					INTEGER			NOT NULL	REFERENCES manager.USERS(id),
	id_role					INTEGER			NOT NULL	REFERENCES manager.ROLES(id),
	UNIQUE (id_user, id_role)
);

-- TABLE USERS_APPLICATIONS_PERMISSIONS
CREATE TABLE manager.USER_APPLICATIONS_PERMISSIONS (
	id_user					INTEGER			NOT NULL	REFERENCES manager.USERS(id),
	id_application			INTEGER			NOT NULL	REFERENCES manager.APPLICATIONS(id),
	access_key				TEXT			NOT NULL,
	UNIQUE (id_user, id_application)
);

-- TABLE SECTIONS_TRANSLATIONS
CREATE TABLE manager.SECTIONS_TRANSLATIONS (
	id_section				INTEGER			NOT NULL 	REFERENCES manager.SECTIONS(id),
	id_language				INTEGER			NOT NULL 	REFERENCES manager.LANGUAGES(id),
	title					TEXT			NULL,
	subtitle				TEXT			NULL,
	description				TEXT			NULL,
	UNIQUE (id_section, id_language)
);

-- TABLE STATIC_CONTENTS_TRANSLATIONS
CREATE TABLE manager.STATIC_CONTENTS_TRANSLATIONS (
	id_static_content		INTEGER			NOT NULL 	REFERENCES manager.STATIC_CONTENTS(id),
	id_language				INTEGER			NOT NULL 	REFERENCES manager.LANGUAGES(id),
	title					TEXT			NULL,
	content					TEXT			NULL,
	target_url				TEXT			NULL,
	UNIQUE (id_static_content, id_language)
);

COMMIT;