/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApisComponent } from './apis.component';

describe('ApisComponent', () => {
	let component: ApisComponent;
	let fixture: ComponentFixture<ApisComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ApisComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ApisComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
