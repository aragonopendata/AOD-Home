import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    private currentUrl = null;
    isAdminSection = true;
    private adminPath = '/admin';

    constructor(private router: Router) { }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if ((event instanceof NavigationEnd)) {
                ga('set', 'page', event.urlAfterRedirects);
                ga('send', 'pageview');
                this.currentUrl = event.url;
                this.isAdminSection = this.currentUrl.indexOf(this.adminPath) !== -1;
            } else {
                return;
            }
            window.scrollTo(0, 0)
        });
    }

    schema = [{
        "@context": {
            "ei2a": "http://opendata.aragon.es/def/e2ia#",
            "dct": "http://purl.org/dc/terms/",
            "dcmi": "http://purl.org/dc/dcmitype/",
            "schema": "http://schema.org/"
        },
        "@type": ["ei2a:Document", "dcmi:InteractiveResource"],
        "dct:title": "Aragon Open Data: Portal de datos abiertos del Gobierno de Aragón",
        "dct:description": "Aragón Open Data ofrece servicios como Open Data Pool, Open Analytics Data, Open Social Data u Open Visual Data ",
        "dct:format": "text/html",
        "dct:date": "2019",
        "dct:coverage": {
            "@type": "schema:Place",
            "@id": "http://opendata.aragon.es/recurso/territorio/ComunidadAutonoma/Arag%C3%B3n"
        },
        "dct:language": "es",
        "dct:creator": {
            "@type": "schema:GovernmentOrganization",
            "@id": "http://opendata.aragon.es/recurso/sectorpublico/organization/gobierno-aragon",
            "schema:name": "Gobierno de Aragón"
        },
        "dct:publisher": {
            "@type": "schema:GovernmentOrganization",
            "@id": "http://opendata.aragon.es/recurso/sectorpublico/organization/gobierno-aragon",
            "schema:name": "Gobierno de Aragón"
        },
        "dct:rights": {
            "@type": "schema:WebPage",
            "@id": "https://opendata.aragon.es/terminos"
        }
    },
    {
        "@context": "http://schema.org/",
        "@type": ["WebPage", "WebSite"],
        "name": "Aragón Open Data ofrece servicios como Open Data Pool, Open Analytics Data, Open Social Data u Open Visual Data",
        "fileFormat": "text/html",
        "datePublished": "2019",
        "spatialCoverage": {
            "@type": "Place",
            "@id": "http://opendata.aragon.es/recurso/territorio/ComunidadAutonoma/Arag%C3%B3n"
        },
        "inLanguage": "es",
        "creator": {
            "@type": "GovernmentOrganization",
            "@id": "http://opendata.aragon.es/recurso/sectorpublico/organization/gobierno-aragon",
            "name": "Gobierno de Aragón"
        },
        "publisher": {
            "@type": "GovernmentOrganization",
            "@id": "http://opendata.aragon.es/recurso/sectorpublico/organization/gobierno-aragon",
            "name": "Gobierno de Aragón"
        },
        "license": {
            "@type": "WebPage",
            "@id": "https://opendata.aragon.es/terminos"
        }
    },
    {
        "@context": "http://schema.org",
        "@type": "GovernmentOrganization",
        "@id": "http://opendata.aragon.es/recurso/sectorpublico/organization/gobierno-aragon",
        "url": "http://www.aragon.es",
        "logo": {
            "@type": "ImageObject",
            "url": "https://opendata.aragon.es/static/public/header/images/AOD-Logo.png"
        },
        "contactPoint": [{
            "@type": "ContactPoint",
            "telephone": "+34 976714000",
            "contactType": "customer support"
        }],
        "sameAs": [
            "https://www.youtube.com/user/GobiernoAragon",
            "https://twitter.com/oasi",
            "https://www.facebook.com/observatorio.aragones"
        ]
    }]
}
