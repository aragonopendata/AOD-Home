/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DashboardGlobalComponent } from './dashboard-global.component';

describe('DashboardGlobalComponent', () => {
	let component: DashboardGlobalComponent;
	let fixture: ComponentFixture<DashboardGlobalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DashboardGlobalComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardGlobalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
