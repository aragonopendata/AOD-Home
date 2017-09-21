import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-open-data-admin',
	templateUrl: './open-data-admin.component.html',
	styleUrls: ['./open-data-admin.component.css']
})
export class OpenDataAdminComponent implements OnInit {

	text: string = '';
	editEnable: boolean = false;
	listOfObj: any[];

	constructor() {

	}

	ngOnInit() {
		this.text = '<h1>Lorem ipsum</h1>' +
			'<br/>' +
			'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
			'Fusce vel odio molestie, eleifend diam in, auctor mi. ' +
			'Morbi vitae risus orci. Vestibulum quis lorem non purus feugiat lacinia at a dui. ' +
			'Nullam iaculis hendrerit ligula sit amet consectetur. Pellentesque fermentum euismod est ac laoreet. ' +
			'Duis eget vestibulum dolor. Etiam velit ipsum, venenatis vel hendrerit eu, pulvinar quis felis. ' +
			'Nunc rutrum sapien a tincidunt aliquet. Cras et quam nulla. Aliquam nec erat sollicitudin, lobortis mi non, aliquet dolor. ' +
			'Vivamus sodales leo non ornare elementum. Aliquam commodo id quam ac consectetur. ' +
			'Pellentesque felis mauris, consequat ut bibendum a, tempor sit amet turpis. ' +
			'Aliquam sit amet libero nec turpis fermentum vestibulum ut sed turpis. ' +
			'Donec tincidunt nisl at dolor cursus, eget tincidunt purus fringilla.</p>';

		this.listOfObj = [
			{ text: this.text, edit: this.editEnable },
			{ text: this.text, edit: this.editEnable },
			{ text: this.text, edit: this.editEnable }, { text: this.text, edit: this.editEnable }
		];
	}

	save(index, text) {
		this.listOfObj[index].edit = !this.listOfObj[index].edit;
		this.listOfObj[index].text = text;
	}

	edit(index) {
		this.listOfObj[index].edit = !this.listOfObj[index].edit;
	}

}
