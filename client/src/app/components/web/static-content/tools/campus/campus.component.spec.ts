/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CampusComponent } from './campus.component';

describe('CampusComponent', () => {
	let component: CampusComponent;
	let fixture: ComponentFixture<CampusComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CampusComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CampusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
