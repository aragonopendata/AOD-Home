import { Component, OnInit } from '@angular/core';
import { DatasetsAdminService } from '../../../../../services/admin/datasets-admin.service';
import { Dataset } from '../../../../../models/Dataset';

@Component({
	selector: 'app-datasets-admin-show',
	templateUrl: './datasets-admin-show.component.html',
	styleUrls: ['./datasets-admin-show.component.css']
})
export class DatasetsAdminShowComponent implements OnInit {

	dataset: Dataset;

	constructor(private datasetsAdminService: DatasetsAdminService) { }

	ngOnInit() {
		this.dataset = this.datasetsAdminService.getDataset();
	}
}
