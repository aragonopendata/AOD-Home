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
/*Get new datasets*/
exports.GET_NEW_DATASETS = "package_search?sort=metadata_modified desc&rows=3&start=0";
/*Get most downloaded datasets*/
exports.GET_DOWNLOADED_DATASETS = "package_search?sort=views_recent desc&rows=3&start=0";

/*TOPICS*/
/*Get all topics*/
exports.GET_TOPICS = "group_list";

/*ORGS*/
/*Get all organizations*/
exports.GET_ORGS = "organization_list";
/*Get organization detail*/
exports.GET_ORG_DETAIL = "organization_show";