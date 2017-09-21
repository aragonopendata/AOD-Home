/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatasetsListComponent } from './datasets-list.component';

describe('DatasetsListComponent', () => {
	let component: DatasetsListComponent;
	let fixture: ComponentFixture<DatasetsListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatasetsListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatasetsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
