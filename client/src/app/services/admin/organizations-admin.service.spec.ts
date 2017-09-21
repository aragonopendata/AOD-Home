/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OrganizationsAdminService } from './organizations-admin.service';

describe('OrganizationsAdminService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [OrganizationsAdminService]
		});
	});

	it('should ...', inject([OrganizationsAdminService], (service: OrganizationsAdminService) => {
		expect(service).toBeTruthy();
	}));
});
