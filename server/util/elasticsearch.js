const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9201' })
const http = require('http');

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
            refresh: 'true',
            body: '"script": { "inline": "ctx._source.portal = \'' + portal.url + '\'"}'
        }).then().catch((error) => {
            console.log(error);
        })
    },
    reloadPortal: function (portal, date) {

        delete_date(date, portal.id_logstash)
        if (portal.type == 'urchin') {
            browsers_urchin(portal, date);
            pages_urchin(portal, date);
            files_urchin(portal, date);
            countries_urchin(portal, date);
        }
        if (portal.type == 'analytics') {
            browsers_ga(portal, date);
            pages_ga(portal, date);
            files_ga(portal, date);
            countries_ga(portal, date);
        }
    }
};

async function browsers_urchin(portal, date) {
    var requestUrl = gapiUrl + '/browsers_urchin?view=' + portal.view + '&date=' + date.getTime();
}

function pages_urchin(portal, date) {
    var requestUrl = gapiUrl + '/pages_urchin?view=' + portal.view + '&date=' + date.getTime();
}

async function files_urchin(portal, date) {
    var requestUrl = gapiUrl + '/files_urchin?view=' + portal.view + '&date=' + date.getTime();
}

async function countries_urchin(portal, date) {
    var requestUrl = gapiUrl + '/countries_urchin?view=' + portal.view + '&date=' + date.getTime();
}

async function browsers_ga(portal, date) {
    var requestUrl = gapiUrl + '/browsers_ga?view=' + portal.view + '&date=' + date.getTime()/1000;

    await http.get(requestUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            var response = JSON.parse(data);
            var indexdate = new Date(resp.headers['custom-date']);
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
                    "browser_name": deviceCategory,
                    "@timestamp": indexdate,
                    "type": 'pages',
                    "portal": portal.url,
                    "platform_name": operatingSystem
                };

                client.index({
                    index: 'logstash-reports-browsers-' + portal.id_logstash,
                    type: 'browsers',
                    refresh: true,
                    body: value
                }).then().catch((error) => {
                    console.log(error);
                });
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}

async function pages_ga(portal, date) {
    var requestUrl = gapiUrl + '/pages_ga?view=' + portal.view + '&date=' + date.getTime()/1000;

    await http.get(requestUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            var response = JSON.parse(data);
            var indexdate = new Date(resp.headers['custom-date']);
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
                    "type": 'pages',
                    "portal": portal.url
                };

                client.index({
                    index: 'logstash-reports-pages-' + portal.id_logstash,
                    type: 'pages',
                    refresh: true,
                    body: value
                }).then().catch((error) => {
                    console.log(error);
                });
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

async function files_ga(portal, date) {
    var requestUrl = gapiUrl + '/files_ga?view=' + portal.view + '&date=' + date.getTime()/1000;

    await http.get(requestUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            var response = JSON.parse(data);
            var indexdate = new Date(resp.headers['custom-date']);
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
                    "type": 'pages',
                    "downloads": parseInt(element.totalEvents),
                    "portal": portal.url
                };

                client.index({
                    index: 'logstash-reports-files-' + portal.id_logstash,
                    type: 'files',
                    refresh: true,
                    body: value
                }).then().catch((error) => {
                    console.log(error);
                });
            });
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}

async function countries_ga(portal, date) {
    var requestUrl = gapiUrl + '/countries_ga?view=' + portal.view + '&date=' + date.getTime()/1000;

    await http.get(requestUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            var response = JSON.parse(data);
            var indexdate = new Date(resp.headers['custom-date']);
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
                    "type": 'pages',
                    "portal": portal.url,
                    "country": country
                };

                client.index({
                    index: 'logstash-reports-countries-' + portal.id_logstash,
                    type: 'countries',
                    refresh: true,
                    body: value
                }).then().catch((error) => {
                    console.log(error);
                });
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

async function delete_date(date, id) {
    await client.deleteByQuery({
        index: 'logstash-reports-*-' + id,
        body: {
            "query": {
                "range": {
                    "@timestamp": {
                        "gte": date,
                        "lte": date
                    }
                }
            }
        }
    }).then().catch((error) => {
        console.log(error);
    });
}