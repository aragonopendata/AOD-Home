/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApisAdminComponent } from './apis-admin.component';

describe('ApisAdminComponent', () => {
	let component: ApisAdminComponent;
	let fixture: ComponentFixture<ApisAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ApisAdminComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ApisAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
