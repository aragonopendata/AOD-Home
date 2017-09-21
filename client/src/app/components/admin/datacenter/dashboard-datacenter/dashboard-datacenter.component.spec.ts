/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DashboardDatacenterComponent } from './dashboard-datacenter.component';

describe('DashboardDatacenterComponent', () => {
	let component: DashboardDatacenterComponent;
	let fixture: ComponentFixture<DashboardDatacenterComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DashboardDatacenterComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardDatacenterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
