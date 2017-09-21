/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UsersAdminComponent } from './users-admin.component';

describe('UsersAdminComponent', () => {
	let component: UsersAdminComponent;
	let fixture: ComponentFixture<UsersAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UsersAdminComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UsersAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
