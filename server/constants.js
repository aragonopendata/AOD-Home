/*Number constants*/
exports.ROWS_NUMBER = 20;

/*General request configuration*/
exports.URL = "http://opendata.aragon.es/datos/api/action/";

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