import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetsAdminService } from '../../../../../services/admin/datasets-admin.service';
import { Dataset } from '../../../../../models/Dataset';
import { Constants } from 'app/app.constants';

@Component({
	selector: 'app-datasets-admin-show',
	templateUrl: './datasets-admin-show.component.html',
	styleUrls: ['./datasets-admin-show.component.css']
})
export class DatasetsAdminShowComponent implements OnInit {

	dataset: Dataset = new Dataset();

	constructor(private datasetsAdminService: DatasetsAdminService, private activatedRoute: ActivatedRoute) { }

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			try {
				this.dataset.name =  params[Constants.ROUTER_LINK_DATA_PARAM_DATASET_NAME];

			} catch (error) {
				console.error("Error: ngOnInit() params - datasets-detail.component.ts");
			}
		});

		if(this.dataset.name){
			this.loadDataset(this.dataset);
		}
	}

		
	loadDataset(dataset: Dataset) {
		this.datasetsAdminService.getDatasetByName(dataset.name).subscribe(dataResult => {
			try {
				console.log(JSON.parse(dataResult).result);
				this.dataset = JSON.parse(dataResult).result;
			} catch (error) {
				console.log(error);
				console.error("Error: loadDataset() - datasets-admin-edit.component.ts");
				
			}
		});
	}
}
