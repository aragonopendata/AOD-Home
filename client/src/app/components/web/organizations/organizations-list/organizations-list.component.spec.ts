/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OrganizationsListComponent } from './organizations-list.component';

describe('OrganizationsListComponent', () => {
	let component: OrganizationsListComponent;
	let fixture: ComponentFixture<OrganizationsListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrganizationsListComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrganizationsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
