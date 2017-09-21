/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RolesAdminComponent } from './roles-admin.component';

describe('RolesAdminComponent', () => {
	let component: RolesAdminComponent;
	let fixture: ComponentFixture<RolesAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RolesAdminComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RolesAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
