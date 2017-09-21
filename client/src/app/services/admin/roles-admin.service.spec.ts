/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RolesAdminService } from './roles-admin.service';

describe('RolesAdminService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [RolesAdminService]
		});
	});

	it('should ...', inject([RolesAdminService], (service: RolesAdminService) => {
		expect(service).toBeTruthy();
	}));
});
