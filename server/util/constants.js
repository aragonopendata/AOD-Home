/* **************** */
/* COMMON CONSTANTS */
exports.REQUEST_ERROR_STATUS_500 = 500;

/* *************** */
/* CKAN PROPERTIES */
exports.CKAN_API_BASE_URL = 'http://opendata.aragon.es/datos/api/action/';

/* DATASETS */
//Results per page in lists
exports.DATASETS_SEARCH_ROWS_PER_PAGE = 20;
//Results in autocomplete
exports.DATASETS_AUTOCOMPLETE_LIMIT = 8;
//Search datasets
exports.DATASETS_SEARCH = 'package_search';
//Get newest datasets
exports.DATASETS_SEARCH_NEWEST = 'package_search?sort=metadata_modified desc&start=0';
//Results per newest datasets
exports.DATASETS_SEARCH_NEWEST_ROWS_LIMIT = 3;
//Get most downloaded datasets
exports.DATASETS_SEARCH_MOST_DOWNLOADED = 'package_search?sort=views_recent desc&start=0';
//Results per most downloaded datasets
exports.DATASETS_SEARCH_MOST_DOWNLOADED_ROWS_LIMIT = 3;
//Get datasets by title
exports.DATASETS_SEARCH_AUTOCOMPLETE = 'package_autocomplete';

/* TOPICS */
//List all topics
exports.TOPICS_LIST = 'group_list';

/* ORGANIZATIONS */
//List all organizations
exports.ORGANIZATIONS_LIST = 'organization_list';
//Show organization detail
exports.ORGANIZATION_DETAIL = 'organization_show';

/* ******************* */
/* DATABASE PROPERTIES */
exports.DB_HOST = 'host';
exports.DB_NAME = 'name';
exports.DB_PORT = 0000;
exports.DB_USER = 'user';
exports.DB_PASSWORD = 'pass';
exports.DB_MAX_CONNECTIONS = 10; //default 10
exports.DB_IDLE_TIMEOUT_MILLIS = 10000; // default 10000 (10 seconds)
exports.DB_CONNECTION_TIMEOUT_MILLIS = 1000;

/* **************** */
/* PROXY PROPERTIES */
exports.REQUESTS_NEED_PROXY = false;
exports.PROXY_USER = 'user';
exports.PROXY_PASS = 'pass';
exports.PROXY_URL = 'url';
exports.PROXY_PORT = 'port';