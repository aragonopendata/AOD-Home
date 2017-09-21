/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CampusAdminComponent } from './campus-admin.component';

describe('CampusAdminComponent', () => {
	let component: CampusAdminComponent;
	let fixture: ComponentFixture<CampusAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CampusAdminComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CampusAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
