/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StaticContentService } from './static-content.service';

describe('StaticContentService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [StaticContentService]
		});
	});

	it('should ...', inject([StaticContentService], (service: StaticContentService) => {
		expect(service).toBeTruthy();
	}));
});
