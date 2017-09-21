/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CollaborationAdminComponent } from './collaboration-admin.component';

describe('CollaborationAdminComponent', () => {
	let component: CollaborationAdminComponent;
	let fixture: ComponentFixture<CollaborationAdminComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CollaborationAdminComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CollaborationAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
