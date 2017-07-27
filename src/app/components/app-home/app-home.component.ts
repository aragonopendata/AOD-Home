import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
    selector: 'app-app-home',
    templateUrl: './app-home.component.html',
    styleUrls: ['./app-home.component.css']
})
export class AppHomeComponent {
    constructor(private router: Router) { }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
    }
}
