/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OpenDataAdminComponent } from './open-data-admin.component';

describe('OpenDataAdminComponent', () => {
	let component: OpenDataAdminComponent;
	let fixture: ComponentFixture<OpenDataAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OpenDataAdminComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OpenDataAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
