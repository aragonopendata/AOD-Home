/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CampusAdminService } from './campus-admin.service';

describe('CampusAdminService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CampusAdminService]
		});
	});

	it('should ...', inject([CampusAdminService], (service: CampusAdminService) => {
		expect(service).toBeTruthy();
	}));
});
