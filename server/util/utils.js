const constants = require('./constants');

module.exports = {
    getRequestCommonParams: function (req) {
        var query = '';
        let sortParams = [];
        let sortOrders = [];
        let sorting = '';
        sorting = req.query.sort;
        if (sorting) {
            sortParams = sorting.replace(' ', '').split(',');
        }
        for (var key in sortParams) {
            sortParams[key].charAt(0) == '-' ? sortOrders.push(constants.SERVER_API_SORT_DESC) : sortOrders.push(constants.SERVER_API_SORT_ASC);
            if (sortParams[key].charAt(0) == '-') {
                sortParams[key] = sortParams[key].slice(1);
            }
        }

        query = '?' + constants.SERVER_API_LINK_PARAM_SORT + '=';
        if (sortParams.length > 0 && sortOrders.length > 0) {
            for (var key in sortParams) {
                query += sortParams[key] + ' ' + sortOrders[key] + ',';
            }
        } else {
            query += constants.SERVER_API_LINK_DEFAULT_SORT;
        }
        if (req.query.rows && req.query.page) {
            query += '&' + constants.SERVER_API_LINK_PARAM_ROWS + '=' + req.query.rows + '&' + constants.SERVER_API_LINK_PARAM_START + '=' + (req.query.page * constants.DATASETS_SEARCH_ROWS_PER_PAGE);
        }

        if (req.query.type) {
            switch (req.query.type) {
                case constants.SERVER_API_LINK_PARAM_TYPE_CALENDAR:
                    query += constants.SERVER_API_LINK_PARAM_TYPE_CALENDAR_QUERY
                    break;
                case constants.SERVER_API_LINK_PARAM_TYPE_PHOTO:
                    query += constants.SERVER_API_LINK_PARAM_TYPE_PHOTO_QUERY
                    break;
                case constants.SERVER_API_LINK_PARAM_TYPE_SPREADSHEET:
                    query += constants.SERVER_API_LINK_PARAM_TYPE_SPREADSHEET_QUERY
                    break;
                case constants.SERVER_API_LINK_PARAM_TYPE_MAPS:
                    query += constants.SERVER_API_LINK_PARAM_TYPE_MAPS_QUERY
                    break;
                case constants.SERVER_API_LINK_PARAM_TYPE_EDUCATION_RESOURCES:
                    query += constants.SERVER_API_LINK_PARAM_TYPE_EDUCATION_RESOURCES_QUERY
                    break;
                case constants.SERVER_API_LINK_PARAM_TYPE_WEB_RESOURCES:
                    query += constants.SERVER_API_LINK_PARAM_TYPE_WEB_RESOURCES_QUERY
                    break;
                case constants.SERVER_API_LINK_PARAM_TYPE_RSS:
                    query += constants.SERVER_API_LINK_PARAM_TYPE_RSS_QUERY
                    break;
                case constants.SERVER_API_LINK_PARAM_TYPE_PLAIN_TEXT:
                    query += constants.SERVER_API_LINK_PARAM_TYPE_PLAIN_TEXT_QUERY
            }
        }
        return query;
    },

    getRequestTags: function (req) {
        var query = '';
        let tagsParams = [];
        let tags = '';
        tags = req.query.tags;
        if (tags) tagsParams = tags.replace(' ', '').split(',');

        query = '&fq=' + constants.SERVER_API_LINK_PARAM_TAGS + ':';
        if (tagsParams.length > 0) {
            for (var key in tagsParams) {
                query += '+' + encodeURIComponent(tagsParams[key]);
            }
        }
        return query;
    },

    getRequestHomerCommonParams: function (req) {
        var query = '';
        let sortParams = [];
        let sortOrders = [];
        let sorting = '';

        sorting = req.query.sort;
        if (sorting) {
            sortParams = sorting.replace(' ', '').split(',');
        }
        for (var key in sortParams) {
            sortParams[key].charAt(0) == '-' ? sortOrders.push(constants.SERVER_API_SORT_DESC) : sortOrders.push(constants.SERVER_API_SORT_ASC);
            if (sortParams[key].charAt(0) == '-') {
                sortParams[key] = sortParams[key].slice(1);
            }
        }

        query = '?' + constants.SERVER_API_LINK_PARAM_SORT + '=';
        if (sortParams.length > 0 && sortOrders.length > 0) {
            for (var key in sortParams) {
                query += sortParams[key] + ' ' + sortOrders[key] + ',';
            }
        } else {
            query += constants.SERVER_API_LINK_DEFAULT_SORT_HOMER;
        }

        if (req.query.rows && req.query.page) {
            query += '&' + constants.SERVER_API_LINK_PARAM_ROWS + '=' + req.query.rows + '&' + constants.SERVER_API_LINK_PARAM_START + '=' + (req.query.page * constants.DATASETS_HOMER_SEARCH_ROWS_PER_PAGE);
        }

        if (req.query.lang != 'undefined') {
            query += '&' + constants.SERVER_API_LINK_PARAM_LANG + '=' + req.query.lang;
        }

        if (req.query.text) {
            query += '&q=' + req.query.text;
        } else {
            query += '&q=*';
        }
        query += constants.SERVER_API_LINK_PARAM_HOMER_RESPONSE_FORMAT;

        return query;
    }
};
