module.exports = {
    getParams: function(req) {
        var query = '';
        let sortParams = [];
        let sortOrders = [];
        let sorting = '';
        sorting = req.query.sort;
        if (sorting) sortParams = sorting.replace(' ', '').split(',');
        for (var key in sortParams) {
            sortParams[key].charAt(0) == '-' ? sortOrders.push('desc') : sortOrders.push('asc');
            if (sortParams[key].charAt(0) == '-') sortParams[key] = sortParams[key].slice(1);
        }
        
        query = '?sort=';
        if (sortParams.length > 0 && sortOrders.length > 0) {
            for (var key in sortParams) {
                query+=sortParams[key]+' '+sortOrders[key]+',';
            }
        }else{
            query += 'relevance asc,metadata_modified desc';
        }
        if (req.query.rows && req.query.page) {
            query += '&rows=' + req.query.rows + '&start=' + (req.query.page * 20);
        }
        return query;
    },

    getTags: function(req) {
        var query = '';
        let tagsParams = [];
        let tags = '';
        tags = req.query.tags;
        if (tags) tagsParams = tags.replace(' ', '').split(',');
        
        query = '&fq=tags:';
        if (tagsParams.length > 0) {
            for (var key in tagsParams) {
                query+="+"+tagsParams[key];
            }
        }
        return query;
    }
  };

