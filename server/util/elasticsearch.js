const constants = require('./constants');
const { Client } = require('@elastic/elasticsearch')
const http = require('http');
const xml = require('xml2js');

const client = new Client({ node: constants.ANALYTICS_ELASTIC_URL })
var gapiUrl = 'http://localhost:50053';

module.exports = {
    deletePortal: function (id) {
        client.indices.delete({
            index: 'logstash-reports-*-' + id,
            ignore_unavailable: true,
            allow_no_indices: true,
        }).then().catch((error) => {
            console.log(error);
        })
    },
    updatePortal: function (portal, id) {
        client.updateByQuery({
            index: 'logstash-reports-*-' + id,
            refresh: true,
            body: {
                "script": {
                    "source": "ctx._source.portal = '" + portal.url + "'"
                }
            }
        }).then().catch((error) => {
            console.log(error);
        })
    },
    reloadPortal: async function (portal, reloadDate) {
        await delete_date(reloadDate, portal.id_logstash)
        if (portal.type == 'urchin') {
            await browsers_urchin(portal, reloadDate);
            await pages_urchin(portal, reloadDate);
            await files_urchin(portal, reloadDate);
            await countries_urchin(portal, reloadDate);
        }
        if (portal.type == 'analytics') {
            await browsers_ga(portal, reloadDate);
            await pages_ga(portal, reloadDate);
            await files_ga(portal, reloadDate);
            await countries_ga(portal, reloadDate);
        }
    }
};

async function browsers_urchin(portal, date) {
    var requestUrl = gapiUrl + '/browsers_urchin?view=' + portal.view + '&date=' + date.getTime() / 1000;
    var http_promise = new Promise((resolve, reject) => {
        http.get(requestUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                xml.parseString(data, function (err, result) {
                    var indexdate = new Date(resp.headers['custom-date']);
                    var r = [];
                    if (result['tns:getDataResponse'] && result['tns:getDataResponse'].record){
                        if (result['tns:getDataResponse'].record.length > 0) {
                            result['tns:getDataResponse'].record.forEach(element => {
                                var browser = element.dimensions[0].dimension[0]._;
                                if (browser === '(not set)' || browser === '(unknown)') {
                                    browser = 'Desconocido';
                                }
                                var operatingSystem = element.dimensions[0].dimension[1]._;
                                if (operatingSystem === '(not set)' || operatingSystem === '(unknown)') {
                                    operatingSystem = 'Desconocido';
                                }
                                var value = {
                                    "visits": parseInt(element.metrics[0]['u:visits'][0]._),
                                    "browser_name": browser,
                                    "@timestamp": indexdate,
                                    "portal": portal.url,
                                    "platform_name": operatingSystem,
                                    "type": "browsers"
                                };
                                r.push(value)
                            });
                        }
                    }
                    resolve(r);
                });
            })

            resp.on('error', (error) => {
                reject(error);
            });
        })
    });

    let responsevalue = await http_promise;

    return index('logstash-reports-browsers-' + portal.id_logstash, responsevalue);
}

async function pages_urchin(portal, date) {
    var requestUrl = gapiUrl + '/pages_urchin?view=' + portal.view + '&date=' + date.getTime() / 1000;

    var http_promise = new Promise((resolve, reject) => {
        http.get(requestUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                xml.parseString(data, function (err, result) {
                    var indexdate = new Date(resp.headers['custom-date']);
                    var r = [];
                    if (result['tns:getDataResponse'] && result['tns:getDataResponse'].record){
                        if (result['tns:getDataResponse'].record.length > 0) {
                            result['tns:getDataResponse'].record.forEach(element => {
                                var pagePath = element.dimensions[0].dimension[0]._;
                                if (pagePath === '(not set)' || pagePath === '(unknown)') {
                                    pagePath = 'Desconocido';
                                }
                                var value = {
                                    "visits": parseInt(element.metrics[0]['u:visits'][0]._),
                                    "@timestamp": indexdate,
                                    "path": pagePath,
                                    "portal": portal.url,
                                    "type": "pages"
                                };
                                r.push(value);
                            });
                        }
                    }
                    resolve(r);
                });
            })

            resp.on('error', (error) => {
                reject(error);
            });
        })
    });

    let responsevalue = await http_promise;

    return index('logstash-reports-pages-' + portal.id_logstash, responsevalue);
}

async function files_urchin(portal, date) {
    var requestUrl = gapiUrl + '/files_urchin?view=' + portal.view + '&date=' + date.getTime() / 1000;

    var http_promise = new Promise((resolve, reject) => {
        http.get(requestUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                xml.parseString(data, function (err, result) {
                    var indexdate = new Date(resp.headers['custom-date']);
                    var r = [];
                    if (result['tns:getDataResponse'] && result['tns:getDataResponse'].record){
                        if (result['tns:getDataResponse'].record.length > 0) {
                            result['tns:getDataResponse'].record.forEach(element => {
                                var eventAction = element.dimensions[0].dimension[0]._;
                                if (eventAction === '(not set)' || eventAction === '(unknown)') {
                                    eventAction = 'Desconocido';
                                }
                                var eventLabel = element.dimensions[0].dimension[1]._;
                                if (eventLabel === '(not set)' || eventLabel === '(unknown)') {
                                    eventLabel = 'Desconocido';
                                }
                                var value = {
                                    "extension": eventAction,
                                    "@timestamp": indexdate,
                                    "path": eventLabel,
                                    "downloads": parseInt(element.metrics[0]['u:validhits'][0]._),
                                    "portal": portal.url,
                                    "type": "files"
                                };
                                r.push(value);
                            });
                        }
                    }
                    resolve(r);
                });
            })

            resp.on('error', (error) => {
                reject(error);
            });
        })
    });
    let responsevalue = await http_promise;

    return index('logstash-reports-files-' + portal.id_logstash, responsevalue);
}

async function countries_urchin(portal, date) {
    var requestUrl = gapiUrl + '/countries_urchin?view=' + portal.view + '&date=' + date.getTime() / 1000;

    var http_promise = new Promise((resolve, reject) => {
        http.get(requestUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                xml.parseString(data, function (err, result) {
                    var indexdate = new Date(resp.headers['custom-date']);
                    var r = [];
                    if (result['tns:getDataResponse'] && result['tns:getDataResponse'].record) {
                        if (result['tns:getDataResponse'].record.length > 0) {
                            result['tns:getDataResponse'].record.forEach(element => {
                                var city = element.dimensions[0].dimension[0]._;
                                if (city === '(not set)' || city === '(unknown)') {
                                    city = 'Desconocido';
                                }
                                var country = element.dimensions[0].dimension[0]._;
                                if (country === '(not set)' || country === '(unknown)') {
                                    country = 'Desconocido';
                                }

                                var region = element.dimensions[0].dimension[1]._;
                                if (region === '(not set)' || region === '(unknown)') {
                                    region = 'Desconocido';
                                }
                                var value = {
                                    "visits": parseInt(element.metrics[0]['u:visits'][0]._),
                                    "geoip": {
                                        "location": {
                                            "lon": parseFloat(element.dimensions[0].dimension[4]._) / 10000,
                                            "lat": parseFloat(element.dimensions[0].dimension[3]._) / 10000
                                        }
                                    },
                                    "city": city,
                                    "region": region,
                                    "@timestamp": indexdate,
                                    "portal": portal.url,
                                    "country": country,
                                    "type": "countries"
                                };
                                r.push(value);
                            });
                        }
                    }
                    resolve(r);
                });
            })
            resp.on('error', (error) => {
                reject(error);
            });
        })
    });
    let responsevalue = await http_promise;

    return index('logstash-reports-countries-' + portal.id_logstash, responsevalue);
}

async function browsers_ga(portal, date) {
    var requestUrl = gapiUrl + '/browsers_ga?view=' + portal.view + '&date=' + date.getTime() / 1000;

    var http_promise = new Promise((resolve, reject) => {
        http.get(requestUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                var response = JSON.parse(data);
                var indexdate = new Date(resp.headers['custom-date']);
                var r = [];
                if (response.reports && response.reports.length > 0) {
                    response.reports[0].report.forEach(element => {
                        var browser = element.browser;
                        if (browser === '(not set)' || browser === '(unknown)') {
                            browser = 'Desconocido';
                        }
                        var deviceCategory = element.deviceCategory;
                        if (deviceCategory === '(not set)' || deviceCategory === '(unknown)') {
                            deviceCategory = 'Desconocido';
                        }
                        var operatingSystem = element.operatingSystem;
                        if (operatingSystem === '(not set)' || operatingSystem === '(unknown)') {
                            operatingSystem = 'Desconocido';
                        }
                        var value = {
                            "device": deviceCategory,
                            "visits": parseInt(element.sessions),
                            "browser_name": browser,
                            "@timestamp": indexdate,
                            "portal": portal.url,
                            "platform_name": operatingSystem,
                            "type": "browsers"
                        };
                        r.push(value);
                    });
                }
                resolve(r);
            });
            resp.on('error', (error) => {
                reject(error);
            });
        })
    });

    let responsevalue = await http_promise;

    return index('logstash-reports-browsers-' + portal.id_logstash, responsevalue);
}

async function pages_ga(portal, date) {
    var requestUrl = gapiUrl + '/pages_ga?view=' + portal.view + '&date=' + date.getTime() / 1000;
    var http_promise = new Promise((resolve, reject) => {
        http.get(requestUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', async () => {
                var response = JSON.parse(data);
                var indexdate = new Date(resp.headers['custom-date']);
                var r = [];
                if (response.reports && response.reports.length > 0) {
                    response.reports[0].report.forEach(element => {
                        var hostname = element.hostname;
                        if (hostname === '(not set)' || hostname === '(unknown)') {
                            hostname = 'Desconocido';
                        }
                        var pagePath = element.pagePath;
                        if (pagePath === '(not set)' || pagePath === '(unknown)') {
                            pagePath = 'Desconocido';
                        }
                        var pageTitle = element.pageTitle;
                        if (pageTitle === '(not set)' || pageTitle === '(unknown)') {
                            pageTitle = 'Desconocido';
                        }
                        var value = {
                            "visits": parseInt(element.sessions),
                            "@timestamp": indexdate,
                            "path": pagePath,
                            "title": pageTitle,
                            "portal": portal.url,
                            "type": "pages"
                        };
                        r.push(value);
                    });
                }
                resolve(r);
            });
            resp.on('error', (error) => {
                reject(error);
            });
        });
    });

    let responsevalue = await http_promise;

    return index('logstash-reports-pages-' + portal.id_logstash, responsevalue);
}

async function files_ga(portal, date) {
    var requestUrl = gapiUrl + '/files_ga?view=' + portal.view + '&date=' + date.getTime() / 1000;
    var http_promise = new Promise((resolve, reject) => {
        http.get(requestUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                var response = JSON.parse(data);
                var indexdate = new Date(resp.headers['custom-date']);
                var r = [];
                if (response.reports && response.reports.length > 0) {
                    response.reports[0].report.forEach(element => {
                        var eventAction = element.eventAction;
                        if (eventAction === '(not set)' || eventAction === '(unknown)') {
                            eventAction = 'Desconocido';
                        }
                        var eventLabel = element.eventLabel;
                        if (eventLabel === '(not set)' || eventLabel === '(unknown)') {
                            eventLabel = 'Desconocido';
                        }
                        var value = {
                            "extension": eventAction,
                            "@timestamp": indexdate,
                            "path": eventLabel,
                            "downloads": parseInt(element.totalEvents),
                            "portal": portal.url,
                            "type": "files"
                        };
                        r.push(value);
                    });
                }
                resolve(r);
            });
            resp.on('error', (error) => {
                reject(error);
            });
        })
    });

    let responsevalue = await http_promise;

    return index('logstash-reports-files-' + portal.id_logstash, responsevalue);
}

async function countries_ga(portal, date) {
    var requestUrl = gapiUrl + '/countries_ga?view=' + portal.view + '&date=' + date.getTime() / 1000;
    var http_promise = new Promise((resolve, reject) => {
        http.get(requestUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                var response = JSON.parse(data);
                var indexdate = new Date(resp.headers['custom-date']);
                var r = [];
                if (response.reports && response.reports.length > 0) {
                    response.reports[0].report.forEach(element => {
                        var city = element.city;
                        if (city === '(not set)' || city === '(unknown)') {
                            city = 'Desconocido';
                        }
                        var country = element.country;
                        if (country === '(not set)' || country === '(unknown)') {
                            country = 'Desconocido';
                        }

                        var region = element.region;
                        if (region === '(not set)' || region === '(unknown)') {
                            region = 'Desconocido';
                        }
                        var value = {
                            "visits": parseInt(element.sessions),
                            "geoip": {
                                "location": {
                                    "lon": parseFloat(element.longitude),
                                    "lat": parseFloat(element.latitude)
                                }
                            },
                            "city": city,
                            "region": region,
                            "@timestamp": indexdate,
                            "portal": portal.url,
                            "country": country,
                            "type": "countries"
                        };
                        r.push(value);
                    });
                }
                resolve(r);
            });
            resp.on('error', (error) => {
                reject(error);
            });
        })
    })

    let responsevalue = await http_promise;

    return index('logstash-reports-countries-' + portal.id_logstash, responsevalue);
}

function delete_date(reloadDate, id) {
    return client.deleteByQuery({
        index: 'logstash-reports-*-' + id,
        body: {
            "query": {
                "range": {
                    "@timestamp": {
                        "gte": reloadDate,
                        "lte": reloadDate
                    }
                }
            }
        }
    }).then().catch((error) => {
        console.log(error);
    });
}

async function index(index, list) {
    if (list && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            var body = list[i];
            await client.index({
                index: index,
                refresh: true,
                type: body.type,
                body: body
            }).then().catch((error) => {
                console.log(error);
            });
        }
    }
}