const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://biv-aodback-01.aragon.local:9200' })
const http = require('http');

var gapiUrl = 'http://localhost:50053';

module.exports = {
    deletePortal: function (id) {
        client.indices.delete({
            index: 'logstash-reports-*-' + id,
            ignore_unavailable: true,
            allow_no_indices: true,
        })
    },
    updatePortal: function (portal, id) {
        client.updateByQuery({
            index: 'logstash-reports-*-' + id,
            refresh: 'true',
            body: '"script": { "inline": "ctx._source.portal = \'' + portal.url + '\'"}'
        })
    },
    reloadPortal: function (portal, date) {
        delete_date(date, portal.id)
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

function browsers_urchin(portal, date) {
    var requestUrl = gapiUrl + '/browsers_urchin?view=' + portal.view + '&date=' + date.getTime();
}

function pages_urchin(portal, date) {
    var requestUrl = gapiUrl + '/pages_urchin?view=' + portal.view + '&date=' + date.getTime();
}

function files_urchin(portal, date) {
    var requestUrl = gapiUrl + '/files_urchin?view=' + portal.view + '&date=' + date.getTime();
}

function countries_urchin(portal, date) {
    var requestUrl = gapiUrl + '/countries_urchin?view=' + portal.view + '&date=' + date.getTime();
}

function browsers_ga(portal, date) {
    var requestUrl = gapiUrl + '/browsers_ga?view=' + portal.view + '&date=' + date.getTime();

    http.get(requestUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            var response = JSON.parse(data);
            response.reports.report.forEach(element => {
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
                    "@timestamp": date,
                    "portal": portal.url,
                    "platform_name": operatingSystem
                };

                client.create({
                    index: 'logstash-reports-browsers-' + portal.id,
                    type: 'browsers',
                    body: value
                });
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}

function pages_ga(portal, date) {
    var requestUrl = gapiUrl + '/pages_ga?view=' + portal.view + '&date=' + date.getTime();

    http.get(requestUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            var response = JSON.parse(data);
            response.reports.report.forEach(element => {
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
                    "@timestamp": date,
                    "path": pagePath,
                    "title": pageTitle,
                    "portal": portal.url
                };

                client.create({
                    index: 'logstash-reports-pages-' + portal.id,
                    type: 'pages',
                    body: value
                });
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

function files_ga(portal, date) {
    var requestUrl = gapiUrl + '/files_ga?view=' + portal.view + '&date=' + date.getTime();

    http.get(requestUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            var response = JSON.parse(data);
            response.reports.report.forEach(element => {
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
                    "@timestamp": date,
                    "path": eventLabel,
                    "downloads": parseInt(element.totalEvents),
                    "portal": portal.url
                };

                client.create({
                    index: 'logstash-reports-files-' + portal.id,
                    type: 'files',
                    body: value
                });
            });
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}

function countries_ga(portal, date) {
    var requestUrl = gapiUrl + '/countries_ga?view=' + portal.view + '&date=' + date.getTime();

    http.get(requestUrl, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            var response = JSON.parse(data);
            response.reports.report.forEach(element => {
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
                    "@timestamp": date,
                    "portal": portal.url,
                    "country": country
                };

                client.create({
                    index: 'logstash-reports-countries-' + portal.id,
                    type: 'countries',
                    body: value
                });
            });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

function delete_date(date, id) {
    client.deleteByQuery({
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
    }, function (error, response) {
        console.log(response);
    });
}