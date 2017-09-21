/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OrganizationsDetailComponent } from './organizations-detail.component';

describe('OrganizationsDetailComponent', () => {
	let component: OrganizationsDetailComponent;
	let fixture: ComponentFixture<OrganizationsDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrganizationsDetailComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrganizationsDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
