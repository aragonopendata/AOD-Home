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
									   + ') AS role '
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