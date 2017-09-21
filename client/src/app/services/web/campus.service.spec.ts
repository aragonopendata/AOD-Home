/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CampusService } from './campus.service';

describe('CampusService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CampusService]
		});
	});

	it('should ...', inject([CampusService], (service: CampusService) => {
		expect(service).toBeTruthy();
	}));
});
