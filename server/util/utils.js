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
            sortParams[key].charAt(0) == '-' ? sortOrders.push('desc') : sortOrders.push('asc');
            if (sortParams[key].charAt(0) == '-') {
                sortParams[key] = sortParams[key].slice(1);
            }
        }

        query = '?sort=';
        if (sortParams.length > 0 && sortOrders.length > 0) {
            for (var key in sortParams) {
                query += sortParams[key] + ' ' + sortOrders[key] + ',';
            }
        } else {
            query += 'relevance asc,metadata_modified desc';
        }
        if (req.query.rows && req.query.page) {
            query += '&rows=' + req.query.rows + '&start=' + (req.query.page * constants.DATASETS_SEARCH_ROWS_PER_PAGE);
        }

        if (req.query.tipo) {
            switch (req.query.tipo) {
                case 'calendario':
                    query += '&q=(res_format:ics OR ICS)AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public'
                    break;
                case 'fotos':
                    query += '&q=(res_format:(jpeg OR JPEG OR jpg OR JPG OR png OR PNG OR gif OR GIF))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public'
                    break;
                case 'hojas-de-calculo':
                    query += '&q=(res_format:(XLS OR xls OR ods OR ODS OR xlsx OR XLSX))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
                    break;
                case 'mapas':
                    query += '&q=(res_format:(dxf OR DXF OR gml OR GML OR geojson OR GEOJSON OR kmz OR KMZ OR shp OR SHP OR dgn OR DGN OR dwg OR DWG))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
                    break;
                case 'recursos-educativos':
                    query += '&q=(name:(recurso-educativo*))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
                    break;
                case 'recursos-web':
                    query += '&q=(res_format:(html OR HTML OR url OR URL))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
                    break;
                case 'rss':
                    query += '&q=(res_format:(rss OR RSS))AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
                    break;
                case 'texto-plano':
                    query += '&q=(((res_format:XLS OR res_format:xls ) AND (res_url:http*.xls )) OR res_format:json OR res_format:JSON OR res_format:xml OR res_format:XML OR res_format:csv OR res_format:CSV OR res_format:px OR res_format:PX OR res_format:url OR res_format:URL) AND dataset_type:dataset AND entity_type:package AND state:active AND capacity:public';
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

        query = '&fq=tags:';
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
            sortParams[key].charAt(0) == '-' ? sortOrders.push('desc') : sortOrders.push('asc');
            if (sortParams[key].charAt(0) == '-') {
                sortParams[key] = sortParams[key].slice(1);
            }
        }

        query = '?sort=';
        if (sortParams.length > 0 && sortOrders.length > 0) {
            for (var key in sortParams) {
                query += sortParams[key] + ' ' + sortOrders[key] + ',';
            }
        } else {
            query += 'field asc';
        }

        if (req.query.rows && req.query.page) {
            query += '&rows=' + req.query.rows + '&start=' + (req.query.page * constants.DATASETS_HOMER_SEARCH_ROWS_PER_PAGE);
        }
        
        if (req.query.lang != 'undefined'){
            query += '&lang='+req.query.lang;
        }
        
        if(req.query.text) {
            query += '&q='+req.query.text;
        }else{
            query += '&q=*';
        }
        query += '&wt=json';

        return query;
    }


};
