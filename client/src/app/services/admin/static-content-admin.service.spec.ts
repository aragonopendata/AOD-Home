/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StaticContentAdminService } from './static-content-admin.service';

describe('StaticContentAdminService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [StaticContentAdminService]
		});
	});

	it('should ...', inject([StaticContentAdminService], (service: StaticContentAdminService) => {
		expect(service).toBeTruthy();
	}));
});
