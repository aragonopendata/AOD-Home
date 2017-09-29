export class Constants {
    //URLS
    public static AOD_BASE_URL = 'http://miv-aodfront-01.aragon.local:7030';
    public static PRESUPUESTOS_BASE_URL = 'http://miv-aodfront-01.aragon.local:7031';
    //public static AOD_API_WEB_BASE_URL = 'http://localhost:4200/aod/services/web';
    public static AOD_API_WEB_BASE_URL = 'http://miv-aodfront-01.aragon.local:4200/aod/services/web';
    //public static AOD_API_ADMIN_BASE_URL = 'http://localhost:4200/aod/services/admin';
    public static AOD_API_ADMIN_BASE_URL = 'http://miv-aodfront-01.aragon.local:4200/aod/services/admin';
    public static AOD_GITHUB_URL = 'http://github.com/aragonopendata';
    public static CKAN_URL = 'http://ckan.org/';
    public static MEDIA_WIKI_URL = 'http://mediawiki.org/';
    public static VIRTUOSO_URL = 'http://virtuoso.openlinksw.com/';
    public static ELDA_URL = 'http://epimorphics.github.io/elda/';
    public static SWAGGER_URL = 'http://swagger.io/';
    public static NODE_JS_URL = 'https://nodejs.org/';
    public static ANGULAR_URL = 'https://angular.io/';
    public static OASI_FACEBOOK_URL = 'https://www.facebook.com/observatorio.aragones';
    public static OASI_TWITTER_URL = 'https://www.twitter.com/oasi';
    public static OASI_YOUTUBE_URL = 'https://www.youtube.com/watch?v=8d409yteTJM&amp;list=PLQ3k0vA0UZvhBVOz_mCq-9Wyn3VCB6QCe';
    public static AOD_MAIL = 'opendata@aragon.es';
    public static ARAGON_PARTICIPA_WEB_URL = 'http://aragonparticipa.aragon.es';
    public static TRANSPARENCIA_WEB_URL = 'http://transparencia.aragon.es/';

    //COMMON CONSTANTS
    public static DATASET_LIST_ROWS_PER_PAGE = 20;
    public static DATASET_LIST_SEARCH_OPTION_FREE_SEARCH = 'busqueda-libre';
    public static DATASET_LIST_SEARCH_OPTION_TOPICS = 'tema-y-tipo';
    public static DATASET_LIST_SEARCH_OPTION_ORGANIZATIONS = 'organizacion-y-tipo';
    public static DATASET_LIST_SEARCH_OPTION_TAGS = 'etiquetas';
    public static DATASET_LIST_SEARCH_OPTION_STATS = 'informacion-estadistica';
    public static DATASET_LIST_SEARCH_OPTION_HOMER = 'buscador-homer';
    public static DATASET_LIST_SORT_COLUMN_NAME = 'name';
    public static DATASET_LIST_SORT_COLUMN_ACCESS = 'accesos';
    public static DATASET_LIST_SORT_COLUMN_LAST_UPDATE = 'lastUpdate';
    public static DATASET_HIGLIGHT_OCURRENCES = '10';
    public static DATASET_HIGLIGHT_DAYS = '14';
    public static DATASET_AUTOCOMPLETE_DEBOUNCE_TIME = 50;
    public static DATASET_AUTOCOMPLETE_MIN_CHARS = 3;
    public static DATASET_AUTOCOMPLETE_LIMIT_RESULTS = 8;
    public static DATASET_AUTOCOMPLETE_HEADER_LIMIT_RESULTS = 4;
    public static ORGANIZATION_COMBO_VIEWS_LIST_OPTION = 'Ver como lista';
    public static ORGANIZATION_COMBO_VIEWS_CARD_OPTION = 'Ver como ficha';
    public static ORGANIZATION_EXTRA_WEBPAGE = 'webpage';
    public static ORGANIZATION_EXTRA_ADDRESS = 'address';
    public static ORGANIZATION_EXTRA_PERSON = 'person';
    public static DATASET_EXTRA_DATA_DICTIONARY_URL = 'Data Dictionary URL';
    public static DATASET_EXTRA_DATA_DICTIONARY = 'Data Dictionary';
    public static DATASET_EXTRA_DATA_QUALITY = 'Data Quality';
    public static DATASET_EXTRA_FREQUENCY = 'Frequency';
    public static DATASET_EXTRA_GRANULARITY = 'Granularity';
    public static DATASET_EXTRA_TEMPORAL_FROM = 'TemporalFrom';
    public static DATASET_EXTRA_TEMPORAL_UNTIL = 'TemporalUntil';
    public static DATASET_EXTRA_NAME_ARAGOPEDIA = 'nameAragopedia';
    public static DATASET_EXTRA_SHORT_URI_ARAGOPEDIA = 'shortUriAragopedia';
    public static DATASET_EXTRA_TYPE_ARAGOPEDIA = 'typeAragopedia';
    public static DATASET_EXTRA_URI_ARAGOPEDIA = 'uriAragopedia';
    //ROUTING
    public static ROUTER_LINK_DATA = 'datos';
    public static ROUTER_LINK_DATA_CATALOG = 'datos/catalogo';
    public static ROUTER_LINK_DATA_CATALOG_TOPICS = 'datos/catalogo/temas';
    public static ROUTER_LINK_DATA_CATALOG_ORGANIZATIONS = 'datos/catalogo/publicadores';
    public static ROUTER_LINK_DATA_CATALOG_TAGS = 'datos/catalogo/etiquetas';
    public static ROUTER_LINK_DATA_CATALOG_STATS = 'datos/catalogo/estadisticas';
    public static ROUTER_LINK_DATA_CATALOG_HOMER = 'datos/catalogo/homer';
    public static ROUTER_LINK_DATA_CATALOG_DATASET = 'datos/catalogo/dataset';
    public static ROUTER_LINK_DATA_TOPICS = 'datos/temas';
    public static ROUTER_LINK_DATA_ORGANIZATIONS = 'datos/publicadores';
    public static ROUTER_LINK_INFORMATION = 'informacion';
    public static ROUTER_LINK_INFORMATION_OPEN_DATA = 'informacion/open-data';
    public static ROUTER_LINK_INFORMATION_APPS = 'informacion/aplicaciones';
    public static ROUTER_LINK_INFORMATION_EVENTS = 'informacion/eventos';
    public static ROUTER_LINK_INFORMATION_COLLABORATION = 'informacion/colabora';
    public static ROUTER_LINK_TOOLS = 'herramientas';
    public static ROUTER_LINK_TOOLS_DEVELOPERS = 'herramientas/desarrolladores';
    public static ROUTER_LINK_TOOLS_CAMPUS = 'herramientas/campus';
    public static ROUTER_LINK_TOOLS_APIS = 'herramientas/apis';
    public static ROUTER_LINK_TOOLS_SPARQL = 'herramientas/sparql';
    public static ROUTER_LINK_TOOLS_SPARQL_CLIENT = 'herramientas/sparql/client';
    public static ROUTER_LINK_LOGIN = 'login';
    public static ROUTER_LINK_LOGIN_FORGOT_PASSWORD = 'login/forgot-password';
    public static ROUTER_LINK_LOGIN_RESTORE_PASSWORD = 'login/restore-password';
    public static ROUTER_LINK_ADMIN = 'admin';
    public static ROUTER_LINK_GLOBAL = 'global';
    public static ROUTER_LINK_ADMIN_GLOBAL = 'admin/global';
    public static ROUTER_LINK_DASHBOARD = 'dashboard';
    public static ROUTER_LINK_ADMIN_GLOBAL_DASHBOARD = 'admin/global/dashboard';
    public static ROUTER_LINK_USERS = 'users';
    public static ROUTER_LINK_ADMIN_GLOBAL_USERS = 'admin/global/users';
    public static ROUTER_LINK_ROLES = 'roles';
    public static ROUTER_LINK_ADMIN_GLOBAL_ROLES = 'admin/global/roles';
    public static ROUTER_LINK_CONTENT = 'content';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT = 'admin/global/content';
    public static ROUTER_LINK_INFO = 'info';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_INFO = 'admin/global/info';
    public static ROUTER_LINK_APPS = 'apps';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_APPS = 'admin/global/apps';
    public static ROUTER_LINK_EVENTS = 'events';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_EVENTS = 'admin/global/events';
    public static ROUTER_LINK_COLLABORATION = 'collaboration';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_COLLABORATION = 'admin/global/collaboration';
    public static ROUTER_LINK_DEVELOPERS = 'developers';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_DEVELOPERS = 'admin/global/developers';
    public static ROUTER_LINK_APIS = 'apis';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_APIS = 'admin/global/apis';
    public static ROUTER_LINK_SPARQL = 'sparql';
    public static ROUTER_LINK_ADMIN_GLOBAL_CONTENT_SPARQL = 'admin/global/sparql';
    public static ROUTER_LINK_DATACENTER = 'datacenter';
    public static ROUTER_LINK_ADMIN_DATACENTER = 'admin/datacenter';
    public static ROUTER_LINK_ADMIN_DATACENTER_DASHBOARD = 'admin/datacenter/dashboard';
    public static ROUTER_LINK_DATASETS = 'datasets';
    public static ROUTER_LINK_ADMIN_DATACENTER_DATASETS = 'admin/datacenter/datasets';
    public static ROUTER_LINK_DATASETS_LIST = 'list';
    public static ROUTER_LINK_ADMIN_DATACENTER_DATASETS_LIST = 'admin/datacenter/datasets/list';
    public static ROUTER_LINK_DATASETS_SHOW = 'show';
    public static ROUTER_LINK_ADMIN_DATACENTER_DATASETS_SHOW = 'admin/datacenter/datasets/show';
    public static ROUTER_LINK_DATASETS_EDIT = 'edit';
    public static ROUTER_LINK_ADMIN_DATACENTER_DATASETS_EDIT = 'admin/datacenter/datasets/edit';
    public static ROUTER_LINK_ORGANIZATIONS = 'organizations';
    public static ROUTER_LINK_ADMIN_DATACENTER_ORGANIZATIONS = 'admin/datacenter/organizations';
    public static ROUTER_LINK_CAMPUS = 'campus';
    public static ROUTER_LINK_ADMIN_DATACENTER_CAMPUS = 'admin/campus';
    public static ROUTER_LINK_404 = 'pagenotfound';
    public static ROUTER_LINK_SERVICES_ARAGOPEDIA = 'servicios/aragopedia';
    public static ROUTER_LINK_SERVICES_PRESUPUESTOS = 'servicios/presupuestos';
    public static ROUTER_LINK_SERVICES_CRAS = 'servicios/cras';
    public static ROUTER_LINK_SERVICES_SOCIAL_DATA = 'servicios/open-social-data';
    public static ROUTER_LINK_DATA_PARAM_DATASET_NAME = 'datasetName';
    public static ROUTER_LINK_DATA_PARAM_TOPIC_NAME = 'topicName';
    public static ROUTER_LINK_DATA_PARAM_ORGANIZATION_NAME = 'organizationName';
    public static ROUTER_LINK_DATA_PARAM_TEXT = 'texto';
    public static ROUTER_LINK_DATA_PARAM_TYPE = 'tipo';
    public static ROUTER_LINK_DATA_PARAM_TAG = 'etq';
    public static ROUTER_LINK_TERMS_FRAGMENT = 'terminos-licencias';

    //SERVER API URLS
    public static SERVER_API_LINK_DATASETS = '/datasets';
    public static SERVER_API_LINK_DATASETS_TOPIC = '/datasets/topic';
    public static SERVER_API_LINK_DATASETS_ORGANIZATION = '/datasets/organization';
    public static SERVER_API_LINK_DATASETS_AUTOCOMPLETE = '/datasets/autocomplete';
    public static SERVER_API_LINK_DATASETS_TAGS = '/datasets/tags';
    public static SERVER_API_LINK_DATASETS_NEWEST = '/datasets/newest';
    public static SERVER_API_LINK_DATASETS_DOWNLOADED = '/datasets/downloaded';
    public static SERVER_API_LINK_DATASETS_COUNT = '/datasets/count';
    public static SERVER_API_LINK_TOPICS = '/topics';
    public static SERVER_API_LINK_ORGANIZATIONS = '/organizations';
    public static SERVER_API_LINK_STATIC_CONTENT_INFO = '/static-content/info';
    public static SERVER_API_LINK_STATIC_CONTENT_INFO_OPEN_DATA = '/open-data';
    public static SERVER_API_LINK_STATIC_CONTENT_INFO_APPLICATIONS = '/applications';
    public static SERVER_API_LINK_STATIC_CONTENT_INFO_EVENTS = '/events';
    public static SERVER_API_LINK_STATIC_CONTENT_TOOLS = '/static-content/tools';
    public static SERVER_API_LINK_STATIC_CONTENT_TOOLS_DEVELOPERS = '/developers';
    public static SERVER_API_LINK_STATIC_CONTENT_TOOLS_APIS = '/apis';
    public static SERVER_API_LINK_STATIC_CONTENT_TOOLS_SPARQL = '/sparql';
    public static SERVER_API_LINK_PARAM_SORT = 'sort';
    public static SERVER_API_LINK_PARAM_PAGE = 'page';
    public static SERVER_API_LINK_PARAM_ROWS = 'rows';
    public static SERVER_API_LINK_PARAM_TYPE = 'type';
    public static SERVER_API_LINK_PARAM_TAGS = 'tags';
    public static SERVER_API_LINK_PARAM_TEXT = 'text';
    public static SERVER_API_LINK_PARAM_LIMIT = 'limit';
    public static SERVER_API_LINK_PARAM_SORT_DEFAULT_VALUE = 'relevance,-metadata_modified';
    public static SERVER_API_LINK_PARAM_SORT_TITLE_STRING = 'title_string';
    public static SERVER_API_LINK_PARAM_SORT_VIEWS_TOTAL = 'views_total';
    public static SERVER_API_LINK_PARAM_SORT_METADATA_MODIFIED = 'metadata_modified';
}
