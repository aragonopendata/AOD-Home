/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SparqlAdminComponent } from './sparql-admin.component';

describe('SparqlAdminComponent', () => {
	let component: SparqlAdminComponent;
	let fixture: ComponentFixture<SparqlAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SparqlAdminComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SparqlAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
