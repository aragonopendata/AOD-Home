exports.DB_ADMIN_GET_USERS_JSON = 'SELECT row_to_json(users) AS "user" '
							 	  + 'FROM ( '
									 + 'SELECT manager.users.id, manager.users.name '
										  + ', manager.users.email, manager.users.fullname '
										  + ', manager.users.description, manager.users.active ' 
										  + ', manager.users.creation_date AS "signupDate", ( '
											   + 'SELECT array_to_json(array_agg(row_to_json(roles))) '
												 + 'FROM ( '
													  + 'SELECT manager.roles.id, manager.roles.name ' 
														   + ', manager.roles.description, manager.roles.active '
														+ 'FROM manager.roles '
														+ 'JOIN manager.users_roles '
														  + 'ON manager.roles.id = manager.users_roles.id_role '
													   + 'WHERE manager.users_roles.id_user = manager.users.id '
												 + ') roles '
									   + ') AS role, '
									   + '(SELECT manager.users_applications_permissions.access_key '
										+ 'FROM manager.users_applications_permissions '
										+ 'WHERE manager.users_applications_permissions.id_user = manager.users.id '
										+ ') AS apiKey '
								  	   + 'FROM manager.users '
									   + 'JOIN manager.users_roles '
										 + 'ON manager.users.id = manager.users_roles.id_user '
								  + ') users';

exports.DB_ADMIN_GET_USER_APP_PERMISSIONS = 'SELECT manager.users.id AS "userId", manager.users.name AS "userName" '
											   + ', manager.users_applications_permissions.access_key AS "accessKey"'
											   + ', manager.users_applications_permissions.id_application AS "applicationId"'
											+ 'FROM manager.users '
											+ 'JOIN manager.users_applications_permissions '
											  + 'ON manager.users_applications_permissions.id_user = manager.users.id '
											+ 'JOIN manager.applications '
											  + 'ON manager.users_applications_permissions.id_application = manager.applications.id '
										   + 'WHERE manager.users.id = $1 '
											 + 'AND manager.users.name = $2 '
											 + 'AND manager.users.active = true '
											 + 'AND manager.applications.appplication_name = $3 '
											 + 'AND manager.applications.active = true';

exports.DB_ADMIN_GET_USER_APIKEY_BY_USER_ID = 'SELECT manager.users_applications_permissions.access_key AS "accessKey" '
												+ 'FROM manager.users '
												+ 'JOIN manager.users_applications_permissions '
												+ 'ON manager.users_applications_permissions.id_user = manager.users.id '
												+ 'JOIN manager.applications '
												+ 'ON manager.users_applications_permissions.id_application = manager.applications.id '
												+ 'WHERE manager.users.id = $1 '
												+ 'AND manager.users.active = true '
												+ 'AND manager.applications.appplication_name = $2 '
												+ 'AND manager.applications.active = true';

exports.DB_ADMIN_INSERT_USER = 'INSERT INTO manager.users (name, password, email, active, description, fullname, creation_date, last_edition_date) '
								  + 'VALUES ($1, $2, $3, $4, $5, $6, now(), now()) '
							   + 'RETURNING manager.users.id';
												 
exports.DB_ADMIN_INSERT_USER_APP_PERMISSION = 'INSERT INTO manager.users_applications_permissions (id_user, id_application, access_key) '
											+ 'VALUES ($1,(SELECT  id FROM manager.applications apps WHERE apps.appplication_name = $2), $3) ' 
											+ 'RETURNING manager.users_applications_permissions.id_user';

exports.DB_ADMIN_INSERT_USERS_ROLES = 'INSERT INTO manager.users_roles (id_user, id_role) '
									+ 'VALUES ($1, $2) '
									+ 'RETURNING manager.users_roles.id_user';


exports.DB_ADMIN_DELETE_USERS_ROLES = 'DELETE FROM manager.users_roles usrrol WHERE usrrol.id_user = $1';
exports.DB_ADMIN_DELETE_USER_APP_PERMISSION = 'DELETE FROM manager.users_applications_permissions apusr WHERE apusr.id_user = $1';
exports.DB_ADMIN_DELETE_USER = 'DELETE FROM manager.users usr where usr.id = $1';

exports.DB_ADMIN_UPDATE_USER = 'UPDATE manager.users '
								+ 'SET  name = $1, fullname = $2, email = $3, description = $4, '
								+ 'active = $5 WHERE id = $6';

exports.DB_ADMIN_UPDATE_USER_ROLES = 'UPDATE manager.users_roles set id_role = $1 where id_user = $2';
													 
exports.DB_ADMIN_GET_ROLES = 'SELECT manager.roles.id, manager.roles.name ' 
								+ ', manager.roles.description, manager.roles.active '
							 + 'FROM manager.roles';

exports.DB_ADMIN_GET_ROLE = 'SELECT manager.roles.id, manager.roles.name ' 
    						   + ', manager.roles.description, manager.roles.active '
							+ 'FROM manager.roles '
						   + 'WHERE manager.roles.id = $1';

exports.DB_ADMIN_GET_LOGSTASH_CONF_ALL = 'SELECT manager.logstash_conf.id_logstash, manager.logstash_conf.portal_name, manager.logstash_conf.type'
								+ ', manager.logstash_conf.view, manager.logstash_conf.delay, manager.logstash_conf.status, manager.logstash_conf.url ' 
							+ 'FROM manager.logstash_conf ORDER BY manager.logstash_conf.portal_name ASC';

exports.DB_ADMIN_INSERT_LOGSTASH = 'INSERT INTO manager.logstash_conf('
								+'portal_name, type, view, delay, url)'
							+'VALUES ($1, $2, $3, $4, $5) '
							+ 'RETURNING manager.logstash_conf.id_logstash;';

exports.DB_ADMIN_UPDATE_LOGSTASH = 'UPDATE manager.logstash_conf '
								+ 'SET portal_name=$1, type=$2, view=$3, delay=$4, url=$5 '
							+ 'WHERE manager.logstash_conf.id_logstash=$6 ';

exports.DB_ADMIN_DELETE_LOGSTASH = 'DELETE FROM manager.logstash_conf '
								+ 'WHERE manager.logstash_conf.id_logstash=$1 ';

exports.DB_ADMIN_RELOAD_LOGSTASH = 'UPDATE manager.logstash_conf '
								+ 'SET status=\'1\' '
							+ 'WHERE manager.logstash_conf.status=\'0\'';


exports.DB_ADMIN_GET_CAMPUS_EVENTS = 'SELECT * from campus.events';
exports.DB_ADMIN_INSERT_CAMPUS_EVENTS = 'INSERT INTO campus.events (name, description, date) VALUES($1, $2, $3)';
exports.DB_ADMIN_UPDATE_CAMPUS_EVENTS = 'UPDATE campus.events SET name = COALESCE($1, name), ' +
									'description = COALESCE($2, description) WHERE id = $3';
exports.DB_ADMIN_GET_CAMPUS_ENTRYS = 'SELECT * from campus.contents WHERE id = $1';
exports.DB_ADMIN_INSERT_CAMPUS_ENTRYS = 'INSERT INTO campus.contents ' +
									'(title, description, url, thumbnail, format, type, platform, event) '+
									'VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
exports.DB_ADMIN_UPDATE_CAMPUS_ENTRYS = 'UPDATE campus.events SET' + 
									'title = COALESCE($1, title),' +
									'description = COALESCE($2, title),, ' +
									'url = COALESCE($3, title),, ' +
									'thumbnail = COALESCE($4, title),, ' +
									'format = COALESCE($5, title),, ' +
									'type = COALESCE($6, title),, ' +
									'platform = COALESCE($7, title),, ' +
									'event = COALESCE($8, title), ' +
									'WHERE id = $9'; 