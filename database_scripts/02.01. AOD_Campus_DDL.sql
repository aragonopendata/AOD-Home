------------------------------------
-- AOD CAMPUS DATABASE DEFINITION --
------------------------------------

-- TABLE DROPS --
-----------------
-- DROP TABLE campus.EVENTS_SITES;
-- DROP TABLE campus.CONTENTS_TOPICS;
-- DROP TABLE campus.CONTENTS_SPEAKERS;
-- DROP TABLE campus.CONTENTS;
-- DROP TABLE campus.SPEAKERS;
-- DROP TABLE campus.SITES;
-- DROP TABLE campus.EVENTS;
-- DROP TABLE campus.FORMATS;
-- DROP TABLE campus.PLATFORMS;
-- DROP TABLE campus.TYPES;
-- DROP TABLE campus.TOPICS;

-- TABLE CREATES -- 
-------------------
-- TABLE TOPICS
CREATE TABLE campus.TOPICS (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	name					TEXT			NULL
);

-- TABLE TYPES
CREATE TABLE campus.TYPES (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	name					TEXT			NULL
);

-- TABLE PLATFORMS
CREATE TABLE campus.PLATFORMS (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	name					TEXT			NULL
);

-- TABLE FORMATS
CREATE TABLE campus.FORMATS (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	name					TEXT			NULL
);

-- TABLE SITES
CREATE TABLE campus.SITES (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	name					TEXT			NULL
);

-- TABLE EVENTS
CREATE TABLE campus.EVENTS (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	name					TEXT			NULL,
	description				TEXT			NULL,
	date					DATE			NULL
);

-- TABLE SPEAKERS
CREATE TABLE campus.SPEAKERS (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	name					TEXT			NULL,
	description				TEXT			NULL
);

-- TABLE CONTENTS
CREATE TABLE campus.CONTENTS (
	id 						SERIAL			NOT NULL 	PRIMARY KEY,
	title					TEXT			NULL,
	description				TEXT			NULL,
	url						TEXT			NULL,
	thumbnail				BYTEA			NULL,
	format 					INTEGER			NOT NULL	REFERENCES campus.FORMATS(id),
	type 					INTEGER			NOT NULL	REFERENCES campus.TYPES(id),
	platform				INTEGER			NOT NULL	REFERENCES campus.PLATFORMS(id),
	event 					INTEGER 		NOT NULL	REFERENCES campus.EVENTS(id)
	-- eliminado campo 'aparece'. movido a tabla speakers
);

-- TABLE EVENTS_SITES
CREATE TABLE campus.EVENTS_SITES (
	id_event				INTEGER			NOT NULL	REFERENCES campus.EVENTS(id),
	id_site					INTEGER			NOT NULL	REFERENCES campus.SITES(id),
	UNIQUE (id_event, id_site)
);

-- TABLE CONTENTS_TOPICS
CREATE TABLE campus.CONTENTS_TOPICS (
	id_content				INTEGER			NOT NULL	REFERENCES campus.CONTENTS(id),
	id_topic				INTEGER			NOT NULL	REFERENCES campus.TOPICS(id),
	UNIQUE (id_content, id_topic)
);

-- TABLE CONTENTS_SPEAKERS
CREATE TABLE campus.CONTENTS_SPEAKERS (
	id_content				INTEGER			NOT NULL	REFERENCES campus.CONTENTS(id),
	id_speaker				INTEGER			NOT NULL	REFERENCES campus.SPEAKERS(id),
	UNIQUE (id_content, id_speaker)
);

COMMIT;