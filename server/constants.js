/*Number constants*/
exports.ROWS_NUMBER = 20;

/*General request configuration*/
exports.URL = "http://opendata.aragon.es/datos/api/action/";
exports.HOSTNAME = "opendata.aragon.es";
exports.PORT = "80";

/*Specific request configuration*/
/*DATASETS*/
/*Get all datasets*/
exports.GET_DATASETS = "package_search";
/*Get datasets by topic
    param id: the id or name of the topic
*/
exports.GET_DATASETS_BY_TOPIC = "group_package_show";

/*TOPICS*/
/*Get all topics*/
exports.GET_TOPICS = "group_list";

/*ORGS*/
/*Get all organizations*/
exports.GET_ORGS = "organization_list";
/*Get organization detail*/
exports.GET_ORG_DETAIL = "organization_show";