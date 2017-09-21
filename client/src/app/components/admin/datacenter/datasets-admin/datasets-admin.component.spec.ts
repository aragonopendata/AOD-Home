/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatasetsAdminComponent } from './datasets-admin.component';

describe('DatasetsAdminComponent', () => {
	let component: DatasetsAdminComponent;
	let fixture: ComponentFixture<DatasetsAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatasetsAdminComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatasetsAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
