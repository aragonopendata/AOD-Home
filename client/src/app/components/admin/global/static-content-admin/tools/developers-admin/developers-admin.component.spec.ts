/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DevelopersAdminComponent } from './developers-admin.component';

describe('DevelopersAdminComponent', () => {
	let component: DevelopersAdminComponent;
	let fixture: ComponentFixture<DevelopersAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DevelopersAdminComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevelopersAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
