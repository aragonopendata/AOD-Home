const { Pool } = require('pg');
const config = require('../conf/db-conf');

const pgPool = new Pool(config.getDatabaseConnectionSettings());

module.exports = {
    getPool: function () {
        if (pgPool) {
            return pgPool;
        }
        return pgPool;
    }
};
