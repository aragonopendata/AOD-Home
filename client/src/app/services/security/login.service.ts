import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoginService {
	// Observable string sources
	private loginAnnouncedSource = new Subject<string>();
	private logoutAnnouncedSource = new Subject<string>();

	// Observable string streams
	loginAnnounced$ = this.loginAnnouncedSource.asObservable();
	logoutAnnounced$ = this.logoutAnnouncedSource.asObservable();

	// Service message commands
	announceLogin(login: string) {
		this.loginAnnouncedSource.next(login);
	}

	announceLogout() {
		this.logoutAnnouncedSource.next(null);
	}
}
