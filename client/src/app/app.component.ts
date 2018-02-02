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

    constructor(private router: Router) {}

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
}
