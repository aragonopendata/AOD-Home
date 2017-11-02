import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/security/authentication.service';
import { LoginService } from '../../services/security/login.service';
import { Constants } from '../../app.constants';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

	model: any = {};
    loading = false;
    error = '';

    constructor(private router: Router, private authenticationService: AuthenticationService, private loginService: LoginService) { }

    ngOnInit() {
        // reset login status
        this.loginService.announceLogout();
        this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password).subscribe(result => {
            if (result === true) {
                // login successful
                this.announce();
                this.router.navigate(['/' + Constants.ROUTER_LINK_ADMIN]);
            } else {
                // login failed
                this.error = 'Usuario o password incorrecto';
                this.loading = false;
            }
        });
    }

    announce() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            return this.loginService.announceLogin(currentUser);
        }
    }
}