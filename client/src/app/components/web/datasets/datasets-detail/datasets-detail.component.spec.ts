/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatasetsDetailComponent } from './datasets-detail.component';

describe('DatasetsDetailComponent', () => {
	let component: DatasetsDetailComponent;
	let fixture: ComponentFixture<DatasetsDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DatasetsDetailComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DatasetsDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
