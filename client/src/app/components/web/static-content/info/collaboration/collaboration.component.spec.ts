/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CollaborationComponent } from './collaboration.component';

describe('CollaborationComponent', () => {
	let component: CollaborationComponent;
	let fixture: ComponentFixture<CollaborationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CollaborationComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CollaborationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
