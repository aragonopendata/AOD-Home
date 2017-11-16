import { Tag } from './../../../../../models/Tag';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { SelectItem, DialogModule, Message } from 'primeng/primeng';
import { DatasetsAdminService } from '../../../../../services/admin/datasets-admin.service';
import { TopicsAdminService } from '../../../../../services/admin/topics-admin.service';
import { OrganizationsAdminService } from '../../../../../services/admin/organizations-admin.service';
import { Dataset } from '../../../../../models/Dataset';
import { Topic } from '../../../../../models/Topic';
import { Organization } from '../../../../../models/Organization';
import { Constants } from 'app/app.constants';
import { UsersAdminService } from 'app/services/admin/users-admin.service';
import { Extra } from 'app/models/Extra';

@Component({
	selector: 'app-datasets-admin-edit',
	templateUrl: './datasets-admin-edit.component.html',
	styleUrls: ['./datasets-admin-edit.component.css']
})

export class DatasetsAdminEditComponent implements OnInit {

	msgs: Message[] = [];

	dataset: Dataset = new Dataset();
	datasetTitleDelete: string;
	datasetNameToDelete: string;
	displayDeleteDialog: boolean = false;

	//Add Resource params
	displayAddResourceDialog: boolean = false;
	newResourceName: string;
	newResourceFormat: string;
	newResourceUrl: string;
	newResourceDescription: string;

	extraDictionary: string;
	extraDictionaryURL: string[];
	extraDataQuality: string;
	extraFrequency: string;
	extraGranularity: string;
	extraTemporalFrom: string;
	extraTemporalUntil: string;
	extraSpatial: string;
	extraUriAragopedia: string;
	extraTypeAragopedia: string;
	extraShortUriAragopedia: string;
	extraNameAragopedia: string;

	
	topic: Topic;
	topics: Topic[];
	topicsSelect: SelectItem[];
	selectedTopic: string;

	orgs: Organization[];
	orgsSelect: SelectItem[];
	selectedOrg: string;

	inputDatasetTitle: string;
	inputDatasetUrl: string;
	inputDatasetDescription: string;
	publishDateInput: Date;
	updateDateInput: Date;

	tags: Tag[];
	filteredTagsMultiple: Tag[];

	value: number = 0;
	checked: boolean = false;
	editEnable: boolean = false;
	splitted: string[];
	baseUrl: string = '';
	editableUrl: string = '';
	languajes: string[];
	freq: SelectItem[];
	urlsCalidad: string[];
	publicadores: SelectItem[] = [];
	selectedPublicador: string;
	accesoRecurso: SelectItem[];
	vistas: SelectItem[];
	formatos: SelectItem[];
	accessModes: SelectItem[];
	accesoSelected: SelectItem;
	uploadedFiles: any[] = [];
	files: string[];

	routerLinkDatasetList: string;

	//Error Params
    errorTitle: string;
    errorMessage: string;
	datasetEditErroTitle: string;
    datasetEditErrorMessage: string;

	constructor(private datasetsAdminService: DatasetsAdminService, private topicsAdminService: TopicsAdminService, private organizationsAdminService: OrganizationsAdminService,
		private usersAdminService: UsersAdminService, private activatedRoute: ActivatedRoute, private router: Router) {
			this.routerLinkDatasetList = Constants.ROUTER_LINK_ADMIN_DATACENTER_DATASETS;
		 }

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			try {
				this.dataset.name =  params[Constants.ROUTER_LINK_DATA_PARAM_DATASET_NAME];
			} catch (error) {
				console.error("Error: ngOnInit() params - datasets-admin-edit.component.ts");
			}
		});

		if(this.dataset.name){
			this.loadDataset(this.dataset);
		}else{
			this.initializeDataset();
		}

		// this.dataset.untilDate = new Date;
		//this.loadDropdowns();
		
		//this.setPublicadores(this.organizationsAdminService.getOrganizations());
		//this.selectedPublicador = this.dataset.organization.name;

		// this.urlsCalidad = [''];

		// this.splitted = this.dataset.url.split('/');
		// this.editableUrl = this.splitted[this.splitted.length - 1];
		// this.splitted.splice(this.splitted.length - 1, 1);
		// this.baseUrl = this.splitted.join('/') + '/';
	}

	initializeDataset() {
		this.dataset = new Dataset();
		this.dataset.extras = new Array ();
		this.dataset.groups = new Array ();
		this.tags = [];
		this.extraDictionaryURL = [];
		this.loadDropdowns();
	}

	loadDropdowns(){
		this.setTopics();
		this.setOrganizations();
		
		this.files = [];
		this.languajes = ['Español', 'Inglés', 'Francés', 'Lenguas aragonesas', 'Otro'];
		this.freq = [
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_ANUAL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_ANUAL.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_SEMESTRAL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_SEMESTRAL.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_CUATRIMESTRAL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_CUATRIMESTRAL.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_TRIMESTRAL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_TRIMESTRAL.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_MENSUAL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_MENSUAL.value },
		];
		this.accesoRecurso = [
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_LINK.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_LINK.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_DB_VIEW.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_DB_VIEW.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_FILE.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_FILE.value }
		];
		this.vistas = [
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_VIEWS_ELECCIONES.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_VIEWS_ELECCIONES.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_VIEWS_SIMBOLOS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_VIEWS_SIMBOLOS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_VIEWS_PLENO_MUNICIPIO.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_VIEWS_PLENO_MUNICIPIO.value }
		];
		this.formatos = [
			{ label: 'Seleccione formato', value: undefined},
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_CSV.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_CSV.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_DGN.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_DGN.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_DWG.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_DWG.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_DXF.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_DXF.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ELP.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ELP.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_GEOJSON.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_GEOJSON.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_GML.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_GML.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_HTML.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_HTML.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ICS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ICS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_JPG.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_JPG.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_JSON.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_JSON.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_KMZ.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_KMZ.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ODS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ODS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_PNG.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_PNG.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_PS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_PS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_RDF.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_RDF.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_RSS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_RSS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_SCORM.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_SCORM.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_SHP.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_SHP.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_SIG.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_SIG.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_TXT.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_TXT.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_URL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_URL.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_XLS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_XLS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_XLSX.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_XLSX.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_XML.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_XML.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ZIP.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ZIP.value }
		];
		this.accessModes = [
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_CSV.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_CSV.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_DGN.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_DGN.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_DWG.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_DWG.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_DXF.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_DXF.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_ELP.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_ELP.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_GEOJSON.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_GEOJSON.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_GML.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_GML.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_HTML.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_HTML.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_ICS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_ICS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_JPG.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_JPG.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_JSON.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_JSON.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_KMZ.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_KMZ.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_ODS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_ODS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_PNG.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_PNG.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_PS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_PS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_RDF.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_RDF.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_RSS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_RSS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_SCORM.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_SCORM.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_SHP.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_SHP.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_SIG.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_SIG.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_TXT.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_TXT.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_URL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_URL.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_XLS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_XLS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_XLSX.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_XLSX.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_XML.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_XML.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_ZIP.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_ZIP.value }
		];

	}
	
	loadDataset(dataset: Dataset) {
		
		this.datasetsAdminService.getDatasetByName(dataset.name).subscribe(dataResult => {
			try {
				this.dataset = JSON.parse(dataResult).result;
				console.log(this.dataset);
				this.inputDatasetTitle = this.dataset.title;
				this.inputDatasetUrl = this.dataset.url;
				this.inputDatasetDescription = this.dataset.notes
				this.getExtras();
				// this.selectedTopic = this.dataset.groups[0].name;
				// this.selectedOrg = this.dataset.organization[0].name;
				this.tags = this.dataset.tags;
				
				//this.getResourceView();
				
				//this.getExtrasIAEST();
				//this.getDatasetsRecommended();
				//this.makeFileSourceList();
				this.loadDropdowns();
			} catch (error) {
				console.log(error);
				console.error("Error: loadDataset() - datasets-admin-edit.component.ts");
				
			}
		});
	}

	// edit() {
	// 	this.editEnable = !this.editEnable;
	// }

	// save() {
	// 	this.editEnable = !this.editEnable;
	// }

	createUrl(){
		if (this.inputDatasetTitle != undefined) {
			let url = this.inputDatasetTitle.toLocaleLowerCase().split(' ').join('-').split('ñ').join('n')
			.split('á').join('a').split('é').join('e').split('í').join('i').split('ó').join('o').split('ú').join('u')
			.split('ä').join('a').split('ë').join('e').split('ï').join('i').split('ö').join('o').split('ü').join('u');
			this.inputDatasetUrl = encodeURI(url);
		}
	}

	setPublicadores(organizations: Organization[]) {
		for (let i = 0; i < organizations.length; i++) {
			this.publicadores.push({ label: organizations[i].name, value: organizations[i].name });
		}
	}

	getSelectedTopic() {
        if (this.topicsAdminService.getTopic() === undefined) {
        } else {
            this.selectedTopic = this.topicsAdminService.getTopic().name;
        }
    }

	setTopics() {
		this.getSelectedTopic();
		this.topicsSelect = [];
		this.topicsSelect.push({ label: 'Seleccione un tema', value: undefined });
		this.topicsAdminService.getTopics().subscribe(topics => {
			try {
				this.topics = JSON.parse(topics).result;
				for (let top of this.topics) {
					this.topicsSelect.push({ label: top.title, value: top.name });
				}
			} catch (error) {
				console.error('Error: setTopics() - datasets-admin-edit.component.ts');
				
			}
		});
	}

	setDatasetTopicByName(topicName: string){
		this.topicsAdminService.getTopicByName(topicName).subscribe(topic =>{
			try {
				this.dataset.groups.push(JSON.parse(topic).result);
			} catch (error) {
				console.error('Error: setDatasetTopicByName() - datasets-admin-edit.component.ts');
			}

		});
		
	}
	
	getSelectedOrg() {
		if (this.dataset.name){
			this.selectedOrg = this.dataset.organization.id;
		}
    }

	setOrganizations() {
		this.getSelectedOrg();
		this.orgsSelect = [];
		this.orgsSelect.push({ label: 'Seleccione una organización', value: undefined });
		this.usersAdminService.getOrganizationsByCurrentUser().subscribe(organizations => {
		// this.organizationsAdminService.getOrganizations().subscribe(organizations => {
			try {
				this.orgs = JSON.parse(organizations).result;
				for (let org of this.orgs) {
					this.orgsSelect.push({ label: org.title, value: org.id });
				}
			} catch (error) {
				console.error('Error: setOrganizations() - datasets-admin-edit.component.ts');
				
			}
		});
	}

	addUrl(url: string){
		if (this.validateURL(url)) {
			this.extraDictionaryURL.push(url);
		} else {
			this.msgs.push({severity:'error', summary:'URL no válida', detail: 'La URL introducida no es válida.'});
		}
		
	}

	validateURL(str) {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return pattern.test(str);
	}

	getExtras() {
		this.extraDictionaryURL = [];
		for (var index = 0; index < this.dataset.extras.length; index++) {
			if (this.dataset.extras[index].key.indexOf(Constants.DATASET_EXTRA_DATA_DICTIONARY_URL) == 0) {
				this.extraDictionaryURL.push(this.dataset.extras[index].value);
			}
			switch (this.dataset.extras[index].key) {
				case Constants.DATASET_EXTRA_DATA_DICTIONARY:
					this.extraDictionary = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_DATA_QUALITY:
					this.extraDataQuality = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_FREQUENCY:
					this.extraFrequency = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_GRANULARITY:
					this.extraGranularity = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_TEMPORAL_FROM:
					this.extraTemporalFrom = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_TEMPORAL_UNTIL:
					this.extraTemporalUntil = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_SPATIAL:
					this.extraSpatial = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_NAME_ARAGOPEDIA:
					this.extraNameAragopedia = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_SHORT_URI_ARAGOPEDIA:
					this.extraShortUriAragopedia = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_TYPE_ARAGOPEDIA:
					this.extraTypeAragopedia = this.dataset.extras[index].value;
					break;
				case Constants.DATASET_EXTRA_URI_ARAGOPEDIA:
					this.extraUriAragopedia = this.dataset.extras[index].value;
					break;
			}
		}
	}

	replaceExtra(extra_key: string, extra_value: string){
		let obj = this.dataset.extras.find((extra, i) => {
			if (extra.key === extra_key) {
				this.dataset.extras[i] = { key: extra_key, value: extra_value };
				return true; // stop searching
			}
		});
	}

	addExtra(extra_key: string, extra_value: string){
		this.dataset.extras.push({ key: extra_key, value: extra_value });
	}

	addTag(tag: Tag){
		this.tags.push(tag);
		console.log(this.tags);
	}

	delTag(tag_name: string){
		let orgTag = '';
		let delTag = '';
		for (var i = 0; i < this.tags.length; i++) {
			orgTag = this.tags[i].display_name;
			delTag = tag_name;
			if(delTag == orgTag){
				this.tags.splice(i,1);
			}
		}
		
	}

	onUpload(event) {
		for (let file of event.files) {
			this.uploadedFiles.push(file);
		}
	}

	deleteFile(index) {
		this.files.splice(index, 1);
	}

	addFile() {
		this.displayAddResourceDialog = true;
		this.files.push('');
	}

	addResource(){
		console.log(this.newResourceUrl);
		console.log(this.newResourceName);
		console.log(this.newResourceDescription);
		console.log(this.newResourceFormat);

	}
	
	checkInsertparams(){
		let valid = false;

		if(this.inputDatasetTitle!=undefined && this.inputDatasetDescription != undefined && this.selectedOrg != undefined){
			valid = true;
		}else{
			this.msgs = [];
			this.msgs.push({severity:'warn', summary:'¡Atención!', detail: 'Faltan por rellenar campos obligatorios'});
		}
		return valid;
	}

	filterTagsMultiple(tag_query: string) {
		let query = tag_query;
		if(query != ''){
			this.datasetsAdminService.getTags(query).subscribe(tags => {
				try {
					this.filteredTagsMultiple = [];
					for (let i = 0; i < tags.result.length; i++) {
						let tag = tags.result[i];
						if (tag.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
							this.filteredTagsMultiple.push(tag);
						}
				   }
				} catch (error) {
					console.error(error);
					console.error('Error filterTagsMultiple() - datasets-admin-edit.component.ts');
				}
			});
		}
	}
	
	//Call when you click Save and End Button
	saveDatasetEnd(){
		this.saveDataset("end");
	}
	
	//Call when you click Save Button
	saveDataset(option: string){
		if(this.dataset.name){
			this.saveDatasetUpdate(option);
		}else{
			this.saveDatasetAdd(option);
		}
	}

	saveDatasetAdd(option: string){
		
		try {
			if (this.checkInsertparams()) {
				//Name and Description TAB
				this.dataset.title = this.inputDatasetTitle;
				this.dataset.notes = this.inputDatasetDescription;
				this.dataset.url = 'http:opendata.com/'+this.inputDatasetUrl;
				this.dataset.name = this.inputDatasetUrl;
				//Groups And Tags TAB
				this.setDatasetTopicByName(this.selectedTopic)
				
				this.dataset.tags = this.tags;

				//Geographic coverage TAB
					//TODO

				//Temporal coverage TAB
				if (this.extraFrequency != undefined) {
					this.addExtra(Constants.DATASET_EXTRA_FREQUENCY, this.extraFrequency);
				}
				if (this.extraTemporalUntil != undefined) {
					this.addExtra(Constants.DATASET_EXTRA_TEMPORAL_UNTIL, this.extraTemporalUntil)
				}
				if (this.extraTemporalFrom != undefined) {
					this.addExtra(Constants.DATASET_EXTRA_TEMPORAL_FROM, this.extraTemporalFrom)
				}
				
				//LANGUAGES TAB
					//TODO
				//EXTRAS TAB
					//TODO DETAIL LEVEL
					//TODO DATA QUALITY
					//TODO DATA QUALITY EXTERNAL LINK??
				if (this.extraDictionary != undefined){
					this.addExtra(Constants.DATASET_EXTRA_DATA_DICTIONARY, this.extraDictionary);
				}
				if (this.extraDictionaryURL.length > 0) {
					for (var i = 0; i < this.extraDictionaryURL.length; i++) {
						this.addExtra(Constants.DATASET_EXTRA_DATA_DICTIONARY_URL+i, this.extraDictionaryURL[i]);
					}
				}
				//LICENSE AND ORGANIZATION TAB
				this.dataset.license_id = Constants.ADMIN_DATASET_EDIT_LICENSE_ID_DEFAULT;
				this.dataset.license_title = Constants.ADMIN_DATASET_EDIT_LICENSE_TITLE_DEFAULT;
				this.dataset.license_url = Constants.ADMIN_DATASET_EDIT_LICENSE_URL_DEFAULT;
				this.dataset.owner_org = this.selectedOrg;

				//FILES TAB
					//TODO all
				
				//OTHER PARAMS
				this.dataset.private = false;
				this.dataset.state = "active";

	
				//Add User Info
				let datasetNew: any = this.dataset;
				datasetNew.requestUserId = this.usersAdminService.currentUser.id;
				datasetNew.requestUserName = this.usersAdminService.currentUser.username;
				console.log(datasetNew)
				
				//CALL TO POST METHOD ON SERVICE
				this.datasetsAdminService.createDataset(datasetNew).subscribe( response => {
					console.log(response);
					this.msgs = [];
					if(response.status == 409){
						this.msgs.push({severity:'warn', summary:response.errorTitle, detail:response.errorDetail});
					}
					if(response.status == 400){
						this.msgs.push({severity:'warn', summary:response.errorTitle, detail:response.errorDetail});
					}
					if(response.status == 200){
						this.msgs.push({severity:'success', summary:'Dataset Creado', detail:'Se ha creado el Dataset con exito'});
						if(option == "end"){
							setTimeout(() => this.router.navigate(['/' + this.routerLinkDatasetList]), 1500)
						}
	
					}
	
				});
			}
		} catch (error) {
			//ERROR HANDLING
			console.error(error);
			console.error('Error saveDatasetAdd() - datasets-admin-edit.component.ts');
		}
	}

	saveDatasetUpdate(option: string){
		console.log("Actualizando dataset");
		this.dataset.title = this.inputDatasetTitle;
		this.dataset.notes = this.inputDatasetDescription;
		if(this.selectedOrg!=undefined){
			this.dataset.organization = this.orgs.find(x => x.id === this.selectedOrg);
			this.dataset.owner_org = this.selectedOrg;
		}
		this.dataset.license_id = Constants.ADMIN_DATASET_EDIT_LICENSE_ID_DEFAULT;
		this.dataset.license_title = Constants.ADMIN_DATASET_EDIT_LICENSE_TITLE_DEFAULT;
		this.dataset.license_url = Constants.ADMIN_DATASET_EDIT_LICENSE_URL_DEFAULT;
		this.dataset.private = false;
		this.dataset.state = "active";
		this.dataset.owner_org = this.selectedOrg;

		if(this.extraFrequency){
			this.replaceExtra(Constants.DATASET_EXTRA_FREQUENCY,this.extraFrequency)
		}
		


		let datasetUpdated: any = this.dataset;
		datasetUpdated.requestUserId = this.usersAdminService.currentUser.id;
		datasetUpdated.requestUserName = this.usersAdminService.currentUser.username;

		this.datasetsAdminService.updateDataset(datasetUpdated).subscribe( response => {
			console.log(response);
			this.msgs = [];
			
			if(response.status == 200){
				this.msgs.push({severity:'success', summary:'Dataset Actualizado', detail:'Se ha actualizado el Dataset con exito'});
				if(option == "end"){
					setTimeout(() => this.router.navigate(['/' + this.routerLinkDatasetList]), 1500)
				}
			}
			if(response.status == 409){
				this.msgs.push({severity:'warn', summary:response.errorTitle, detail:response.errorDetail});
			} else if (response.status != 200) {
				this.msgs.push({severity:'warn', summary:response.errorTitle, detail:response.errorDetail});
			}
		

		});
		
		// this.setDatasetTopicByName(this.selectedTopic);
		// this.dataset.tags = this.tags;
		// this.dataset.license_id = Constants.ADMIN_DATASET_EDIT_LICENSE_ID_DEFAULT;
		// this.dataset.license_title = Constants.ADMIN_DATASET_EDIT_LICENSE_TITLE_DEFAULT;
		// this.dataset.license_url = Constants.ADMIN_DATASET_EDIT_LICENSE_URL_DEFAULT;
		// console.log(this.updateDateInput);
		// console.log(this.publishDateInput);
		//console.log(this.dataset);
	}

	showDeleteDialog(datasetTitle: string, datasetName: string){
        console.log(datasetName);
        this.datasetTitleDelete = datasetTitle;
        this.displayDeleteDialog = true;
        this.datasetNameToDelete = datasetName;
    }

    deleteDataset(){
        this.displayDeleteDialog=false;
        let user_id = this.usersAdminService.currentUser.id;
        let user_name = this.usersAdminService.currentUser.username;
        this.datasetsAdminService.removeDataset(this.datasetNameToDelete,user_name, user_id).subscribe( response => {
            this.router.navigate(['/' + this.routerLinkDatasetList]); 
        });
    }

    undoDeleteDataset(){
        this.displayDeleteDialog=false;
        this.datasetNameToDelete = undefined;
    }

}
