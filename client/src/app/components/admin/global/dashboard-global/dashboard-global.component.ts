import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-dashboard-global',
	templateUrl: './dashboard-global.component.html',
	styleUrls: ['./dashboard-global.component.css']
})
export class DashboardGlobalComponent implements OnInit {

	data: any;
	data2: any;
	data3: any;

	constructor() {
		this.data = {
			labels: ['Organización 1', 'Organización 2', 'Organización 3'],
			datasets: [
				{
					data: [300, 50, 100],
					backgroundColor: [
						'#FF6384',
						'#36A2EB',
						'#FFCE56'
					],
					hoverBackgroundColor: [
						'#FF6384',
						'#36A2EB',
						'#FFCE56'
					]
				}]
		};

		this.data2 = {
			labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
				'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			datasets: [
				{
					label: '2017',
					data: [65, 59, 80, 81, 56, 0, 0, 0, 0, 0, 0, 0],
					fill: false,
					borderColor: '#4bc0c0'
				}
			]
		};

		this.data3 = {
			labels: ['Curso', 'Debate', 'Entrevista'],
			datasets: [
				{
					label: 'Tipos',
					backgroundColor: '#42A5F5',
					borderColor: '#1E88E5',
					data: [65, 59, 80]
				}
			]
		};
	}

	ngOnInit() {
	}

}
