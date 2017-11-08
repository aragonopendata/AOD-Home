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
												 + 'VALUES ($1, $2, $3) ' 
											  + 'RETURNING manager.users_applications_permissions.id_user';

exports.DB_ADMIN_INSERT_USERS_ROLES = 'INSERT INTO manager.users_roles (id_user, id_role) '
										 + 'VALUES ($1, $2) '
									  + 'RETURNING manager.users_roles.id_user';

exports.DB_ADMIN_GET_ROLES = 'SELECT manager.roles.id, manager.roles.name ' 
								+ ', manager.roles.description, manager.roles.active '
							 + 'FROM manager.roles';

exports.DB_ADMIN_GET_ROLE = 'SELECT manager.roles.id, manager.roles.name ' 
    						   + ', manager.roles.description, manager.roles.active '
							+ 'FROM manager.roles '
						   + 'WHERE manager.roles.id = $1';