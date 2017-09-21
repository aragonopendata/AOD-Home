/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OrganizationsAdminComponent } from './organizations-admin.component';

describe('OrganizationsAdminComponent', () => {
	let component: OrganizationsAdminComponent;
	let fixture: ComponentFixture<OrganizationsAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrganizationsAdminComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrganizationsAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
