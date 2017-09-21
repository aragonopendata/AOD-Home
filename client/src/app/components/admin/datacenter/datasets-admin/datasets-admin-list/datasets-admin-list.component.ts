import { Component, OnInit } from '@angular/core';
import { DatasetsAdminService } from '../../../../../services/admin/datasets-admin.service';
import { Dataset } from '../../../../../models/Dataset';
import { Organization } from '../../../../../models/Organization';
import { Topic } from '../../../../../models/Topic';

@Component({
	selector: 'app-datasets-admin-list',
	templateUrl: './datasets-admin-list.component.html',
	styleUrls: ['./datasets-admin-list.component.css']
})
export class DatasetsAdminListComponent implements OnInit {

	datasets: Dataset[] = [];
	dataset: Dataset;

	constructor(private datasetsAdminService: DatasetsAdminService) { }

	ngOnInit() {
		//this.datasets = this.datasetService.getDatasets();
	}

	showDataset(dataset: Dataset) {
		this.datasetsAdminService.setDataset(dataset);
	}

	addDataset() {
		this.dataset = new Dataset();
		this.datasetsAdminService.setDataset(this.dataset);
	}

}
