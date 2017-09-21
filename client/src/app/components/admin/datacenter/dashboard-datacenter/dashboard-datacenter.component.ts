import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-dashboard-datacenter',
	templateUrl: './dashboard-datacenter.component.html',
	styleUrls: ['./dashboard-datacenter.component.css']
})
export class DashboardDatacenterComponent implements OnInit {

	data: any;
	data2: any;
	data3: any;

	constructor() {
		this.data = {
			labels: ['Calendario', 'Fotos', 'Hojas de cálculo', 'Mapas', 'Recursos Educativos', 'Recursos web'],
			datasets: [
				{
					label: 'Organización 1',
					backgroundColor: 'rgba(179,181,198,0.2)',
					borderColor: 'rgba(179,181,198,1)',
					pointBackgroundColor: 'rgba(179,181,198,1)',
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: 'rgba(179,181,198,1)',
					data: [65, 59, 90, 81, 68, 75]
				}
			]
		};

		this.data2 = {
			labels: ['Organización 1', 'Organización 2', 'Organización 3'],
			datasets: [
				{
					label: 'Datasets',
					backgroundColor: '#42A5F5',
					borderColor: '#1E88E5',
					data: [65, 59, 70]
				}
			]
		};

		this.data3 = {
			labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
				'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			datasets: [
				{
					label: 'Organización 1',
					data: [97, 65, 23, 81, 56, 23, 0, 0, 0, 0, 0, 0],
					fill: false,
					borderColor: '#b34c37'
				},
				{
					label: 'Organización 2',
					data: [70, 45, 34, 70, 88, 12, 0, 0, 0, 0, 0, 0],
					fill: false,
					borderColor: '#4bc0c0'
				},
				{
					label: 'Organización 3',
					data: [65, 59, 80, 45, 56, 43, 0, 0, 0, 0, 0, 0],
					fill: false,
					borderColor: '#12d48a'
				}
			]
		};
	}

	ngOnInit() {
	}

}
