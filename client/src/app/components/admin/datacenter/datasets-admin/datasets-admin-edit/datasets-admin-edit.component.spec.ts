/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatasetsAdminEditComponent } from './datasets-admin-edit.component';

describe('DatasetAdminEditComponent', () => {
	let component: DatasetsAdminEditComponent;
	let fixture: ComponentFixture<DatasetsAdminEditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatasetsAdminEditComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatasetsAdminEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
