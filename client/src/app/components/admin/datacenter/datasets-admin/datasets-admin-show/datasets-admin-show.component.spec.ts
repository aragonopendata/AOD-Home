/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatasetsAdminShowComponent } from './datasets-admin-show.component';

describe('DatasetsAdminShowComponent', () => {
	let component: DatasetsAdminShowComponent;
	let fixture: ComponentFixture<DatasetsAdminShowComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatasetsAdminShowComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatasetsAdminShowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
