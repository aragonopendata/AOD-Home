/* **************** */
/* COMMON CONSTANTS */
exports.EXPRESS_NODE_REDIRECT_ROUTING_URL = 'http://miv-aodfront-01.aragon.local:7030';
exports.EXPRESS_NODE_STARTING_PORT = 4200;
exports.REQUEST_ERROR_STATUS_500 = 500;
/* CORS */
exports.CORS_HEADERS_ALLOW_ORIGIN_HEADER = 'Access-Control-Allow-Origin';
exports.CORS_HEADERS_ALLOW_ORIGIN_VALUE = '*';
exports.CORS_HEADERS_ALLOW_HEADERS_HEADER = 'Access-Control-Allow-Headers';
exports.CORS_HEADERS_ALLOW_HEADERS_VALUE = 'Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Content-Type, Origin, X-Requested-With, Accept, Authorization';
exports.CORS_HEADERS_ALLOW_METHODS_HEADER = 'Access-Control-Allow-Methods';
exports.CORS_HEADERS_ALLOW_METHODS_VALUE = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
/* API URLS AND CONSTANTS */
exports.API_BASE_URL_WEB = '/aod/services/web';
exports.API_BASE_URL_ADMIN = '/aod/services/admin';
exports.API_URL_DATASETS = '/datasets';
exports.API_URL_DATASETS_HOMER = '/homer';
exports.API_URL_DATASETS_AUTOCOMPLETE = '/datasets/autocomplete';
exports.API_URL_DATASETS_TAGS = '/datasets/tags';
exports.API_URL_DATASETS_NEWEST = '/datasets/newest';
exports.API_URL_DATASETS_DOWNLOADED = '/datasets/downloaded';
exports.API_URL_DATASETS_COUNT = '/datasets/count';
exports.API_URL_DATASETS_TOPIC = '/datasets/topic';
exports.API_URL_DATASETS_ORGANIZATION = '/datasets/organization';
exports.API_URL_ORGANIZATIONS = '/organizations';
exports.API_URL_TOPICS = '/topics';
exports.API_URL_TAGS = '/tags';
exports.API_URL_STATIC_CONTENT_INFO_OPEN_DATA = '/static-content/info/open-data';
exports.API_URL_STATIC_CONTENT_INFO_APPS = '/static-content/info/applications';
exports.API_URL_STATIC_CONTENT_INFO_EVENTS = '/static-content/info/events';
exports.API_URL_STATIC_CONTENT_INFO_COLLABORATION = '/static-content/info/collaboration';
exports.API_URL_STATIC_CONTENT_TOOLS_DEVELOPERS = '/static-content/tools/developers';
exports.API_URL_STATIC_CONTENT_TOOLS_APIS = '/static-content/tools/apis';
exports.API_URL_STATIC_CONTENT_TOOLS_SPARQL = '/static-content/tools/sparql';
exports.STATIC_CONTENT_SECTION_TITLE_INFO = 'INFORMACIÓN';
exports.STATIC_CONTENT_SECTION_TITLE_TOOLS = 'HERRAMIENTAS';
exports.STATIC_CONTENT_SUBSECTION_TITLE_OPEN_DATA = 'OPEN DATA';
exports.STATIC_CONTENT_SUBSECTION_TITLE_APPS = 'APLICACIONES';
exports.STATIC_CONTENT_SUBSECTION_TITLE_EVENTS = 'EVENTOS';
exports.STATIC_CONTENT_SUBSECTION_TITLE_COLLABORATION = 'COLABORA';
exports.STATIC_CONTENT_SUBSECTION_TITLE_DEVELOPERS = 'DESARROLLADORES';
exports.STATIC_CONTENT_SUBSECTION_TITLE_APIS = 'APIS';
exports.STATIC_CONTENT_SUBSECTION_TITLE_SPARQL = 'SPARQL';

/* SQL CONSTANTS */
exports.SQL_RESULSET_FORMAT = 'json';


/* *************** */
/* CKAN PROPERTIES */
exports.CKAN_API_BASE_URL = 'http://opendata.aragon.es/datos/api/action/';
exports.AOD_API_WEB_BASE_URL = 'http://localhost:4200/aod/services/web';

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
//Get dataset by name
exports.DATASET_SHOW = 'package_show';

/* TOPICS */
//List all topics
exports.TOPICS_LIST = 'group_list';

/* ORGANIZATIONS */
//List all organizations
exports.ORGANIZATIONS_LIST = 'organization_list';
//Show organization detail
exports.ORGANIZATION_DETAIL = 'organization_show';

/* TAGS */
//List all tags
exports.TAGS_LIST = 'tag_list';

/* HOMER PROPERTIES */
exports.HOMER_API_BASE_URL = 'http://opendata-federation.csi.it/fed-homer/documents/select';
//Results per page in lists
exports.DATASETS_HOMER_SEARCH_ROWS_PER_PAGE = 20;

exports.SERVER_API_LINK_PARAM_SORT = 'sort';
exports.SERVER_API_LINK_DEFAULT_SORT = 'relevance asc,metadata_modified desc';
exports.SERVER_API_LINK_DEFAULT_SORT_HOMER = 'field asc';
exports.SERVER_API_LINK_PARAM_START = 'start';
exports.SERVER_API_LINK_PARAM_ROWS = 'rows';
exports.SERVER_API_LINK_PARAM_TYPE = 'type';
exports.SERVER_API_LINK_PARAM_TAGS = 'tags';
exports.SERVER_API_LINK_PARAM_TEXT = 'text';
exports.SERVER_API_LINK_PARAM_LANG = 'lang';
exports.SERVER_API_LINK_PARAM_LIMIT = 'limit';
exports.SERVER_API_LINK_PARAM_HOMER_RESPONSE_FORMAT = '&wt=json';

exports.SERVER_API_SORT_DESC = 'desc';
exports.SERVER_API_SORT_ASC = 'asc';

exports.SERVER_API_LINK_PARAM_TYPE_CALENDAR = 'calendario';
exports.SERVER_API_LINK_PARAM_TYPE_PHOTO = 'fotos';
exports.SERVER_API_LINK_PARAM_TYPE_SPREADSHEET = 'hojas-de-calculo';
exports.SERVER_API_LINK_PARAM_TYPE_MAPS = 'mapas';
exports.SERVER_API_LINK_PARAM_TYPE_EDUCATION_RESOURCES = 'recursos-educativos';
exports.SERVER_API_LINK_PARAM_TYPE_WEB_RESOURCES = 'recursos-web';
exports.SERVER_API_LINK_PARAM_TYPE_RSS = 'rss';
exports.SERVER_API_LINK_PARAM_TYPE_PLAIN_TEXT = 'texto-plano';

exports.SERVER_API_LINK_PARAM_TYPE_CALENDAR_QUERY = '&q=(res_format:ics OR ICS)AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
exports.SERVER_API_LINK_PARAM_TYPE_PHOTO_QUERY = '&q=(res_format:(jpeg OR JPEG OR jpg OR JPG OR png OR PNG OR gif OR GIF))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
exports.SERVER_API_LINK_PARAM_TYPE_SPREADSHEET_QUERY = '&q=(res_format:(XLS OR xls OR ods OR ODS OR xlsx OR XLSX))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
exports.SERVER_API_LINK_PARAM_TYPE_MAPS_QUERY = '&q=(res_format:(dxf OR DXF OR gml OR GML OR geojson OR GEOJSON OR kmz OR KMZ OR shp OR SHP OR dgn OR DGN OR dwg OR DWG))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
exports.SERVER_API_LINK_PARAM_TYPE_EDUCATION_RESOURCES_QUERY = '&q=(name:(recurso-educativo*))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
exports.SERVER_API_LINK_PARAM_TYPE_WEB_RESOURCES_QUERY = '&q=(res_format:(html OR HTML OR url OR URL))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
exports.SERVER_API_LINK_PARAM_TYPE_RSS_QUERY = '&q=(res_format:(rss OR RSS))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
exports.SERVER_API_LINK_PARAM_TYPE_PLAIN_TEXT_QUERY = '&q=(((res_format:XLS OR res_format:xls ) AND (res_url:http*.xls )) OR res_format:json OR res_format:JSON OR res_format:xml OR res_format:XML OR res_format:csv OR res_format:CSV OR res_format:px OR res_format:PX OR res_format:url OR res_format:URL) AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';

/* ******************* */
/* DATABASE PROPERTIES */
exports.DB_HOST = '';
exports.DB_NAME = '';
exports.DB_PORT = 0;
exports.DB_USER = '';
exports.DB_PASSWORD = '';
exports.DB_MAX_CONNECTIONS = 10; //default 10
exports.DB_IDLE_TIMEOUT_MILLIS = 10000; // default 10000 (10 seconds)
exports.DB_CONNECTION_TIMEOUT_MILLIS = 1000;

/* **************** */
/* PROXY PROPERTIES */
exports.REQUESTS_NEED_PROXY = false;
exports.PROXY_USER = '';
exports.PROXY_PASS = '';
exports.PROXY_URL = '';
exports.PROXY_PORT = '';