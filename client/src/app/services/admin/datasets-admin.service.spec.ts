/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DatasetsAdminService } from './datasets-admin.service';

describe('DatasetsAdminService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DatasetsAdminService]
		});
	});

	it('should ...', inject([DatasetsAdminService], (service: DatasetsAdminService) => {
		expect(service).toBeTruthy();
	}));
});
