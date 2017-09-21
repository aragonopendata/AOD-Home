import { TestBed, inject } from '@angular/core/testing';

import { TopicsAdminService } from './topics-admin.service';

describe('TopicsAdminService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [TopicsAdminService]
		});
	});

	it('should be created', inject([TopicsAdminService], (service: TopicsAdminService) => {
		expect(service).toBeTruthy();
	}));
});
