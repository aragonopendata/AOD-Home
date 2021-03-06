import { Tag } from './../../../../../models/Tag';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit,  ViewEncapsulation} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { SelectItem, DialogModule, Message, CalendarModule } from 'primeng/primeng';
import { DatasetsAdminService } from '../../../../../services/admin/datasets-admin.service';
import { FilesAdminService } from '../../../../../services/admin/files-admin.service';
import { TopicsAdminService } from '../../../../../services/admin/topics-admin.service';
import { OrganizationsAdminService } from '../../../../../services/admin/organizations-admin.service';
import { Dataset } from '../../../../../models/Dataset';
import { Topic } from '../../../../../models/Topic';
import { Organization } from '../../../../../models/Organization';
import { Constants } from 'app/app.constants';
import { UsersAdminService } from 'app/services/admin/users-admin.service';
import { AodCoreAdminService } from 'app/services/admin/aod-core-admin.service';
import { Extra } from 'app/models/Extra';
import { Resource } from 'app/models/Resource';
import { saveAs } from 'file-saver';

declare var jQuery:any;

@Component({
	selector: 'app-datasets-admin-edit',
	templateUrl: './datasets-admin-edit.component.html',
	styleUrls: ['./datasets-admin-edit.component.css'],
	encapsulation: ViewEncapsulation.None
})

export class DatasetsAdminEditComponent implements OnInit {

	msgs: Message[] = [];

	dataset: Dataset = new Dataset();
	datasetTitleDelete: string;
	datasetNameToDelete: string;
	displayDeleteDialog: boolean = false;
	displayAutoSavedDeleteDialog: boolean = false;
	datasetLoaded: boolean = false;
	datasetTags: Tag[];
	tagTitle = new Subject<string>();
	tagValue: string;

	resource: Resource;
	resources: Resource [] = [];
	resourceType: string;
	resourceOperation: boolean;

	//Add Resource params
	//BORRAMEdisplayAddResourceDialog: boolean = false;
	newResourceName: string;
	newResourceFormat: string;
	newResourceUrl: string;
	newResourceDescription: string;
	fileList: FileList;

	es: any;

	extraDictionary: string;
	extraDictionaryURL: string[];
	extraDataQuality: string;
	extraDataQualityURL: string[];
	extraFrequency: string;
	extraGranularity: string;
	extraTemporalFrom: string;
	extraTemporalUntil: string;
	extraUriAragopedia: string;
	extraTypeAragopedia: string;
	extraShortUriAragopedia: string;
	extraNameAragopedia: string;

	isIAESTDataset: boolean = false;
	extraIAESTTemaEstadistico: string;
	extraIAESTUnidadEstadistica: string;
	extraIAESTPoblacionEstadistica: string;
	extraIAESTUnidadMedida: string;
	extraIAESTPeriodoBase: string;
	extraIAESTTipoOperacion: string;
	extraIAESTTipologiaDatosOrigen: string;
	extraIAESTFuente: string;
	extraIAESTTratamientoEstadistico: string;
	extraIAESTLegislacionUE: string;

	selectedState: string = 'public';

	//LANGUAGES
	checkLangEs: string;
	checkLangEn: string;
	checkLangFr: string;
	checkLangArg_Lng: string;
	checkLangOther: string;

	checkLangBoolEs: boolean = false;
	checkLangBoolEn: boolean = false;
	checkLangBoolFr: boolean = false;
	checkLangBoolArg_Lng: boolean = false;
	checkLangBoolOther: boolean = false;
	
	aragonRadioValue: boolean = false;
	provinciaRadioValue: boolean = false;
	comarcaRadioValue: boolean = false;
	municipioRadioValue: boolean = false;
	otherRadioValue: boolean = false;

	newResourceAccessType: string;
	newResourceAccessTypes: SelectItem[];
	newResourceAccessTypePublicFile: string;
	newResourceAccessTypeDatabaseView: string;
	newResourceAccessTypeFile: string;

	coreViewsSelect: SelectItem[];
	selectedCoreView: string;

	provinciaInput: string;
	comarcaInput: string;
	municipioInput: string;
	otherInputGeo: string;

	//PARAMS FOR ROUTES EXTRA
	currentAbsoluteUrl: string;
	currentRelativeUrl: string;
	index: number;
	baseUrl: string;
	
	//BORRAMEtopic: Topic;
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

	tags: Tag[] = [];
	filteredTagsMultiple: Tag[];

	freq: SelectItem[];
	urlsCalidad: string[];
	publicadores: SelectItem[] = [];
	selectedPublicador: string;
	accesoRecurso: SelectItem[];
	formatos: SelectItem[];
	accessModes: SelectItem[];

	routerLinkDatasetList: string;

	//Error Params
    errorTitle: string;
    errorMessage: string;
	datasetEditErroTitle: string;
	datasetEditErrorMessage: string;
	
	// Control for enabled tabs
	activeTab = [true, false, false];
	unlockedTabs = 0;
	currentTab = 0;

	// mapeo file
	mapeo_file_tmp = undefined;
	showMapLink = false;

	// Controls if the dataset has already be saved in CKAN
	previouslySaved = false;
	autoSaved = false;

	constructor(private datasetsAdminService: DatasetsAdminService, private topicsAdminService: TopicsAdminService, private organizationsAdminService: OrganizationsAdminService,
		private usersAdminService: UsersAdminService, private aodCoreAdminService: AodCoreAdminService, private activatedRoute: ActivatedRoute, private router: Router, private filesAdminService: FilesAdminService) {
			this.routerLinkDatasetList = Constants.ROUTER_LINK_ADMIN_DATACENTER_DATASETS;
			this.newResourceAccessTypePublicFile = Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_URL_PUBLIC_FILE.value;
			this.newResourceAccessTypeDatabaseView = Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_DATABASE_VIEW.value;
			this.newResourceAccessTypeFile = Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_FILE.value;
			this.checkLangEs = Constants.ADMIN_DATASET_EDIT_DROPDOWN_LANG_ES;
			this.checkLangEn = Constants.ADMIN_DATASET_EDIT_DROPDOWN_LANG_EN;
			this.checkLangFr = Constants.ADMIN_DATASET_EDIT_DROPDOWN_LANG_FR;
			this.checkLangArg_Lng = Constants.ADMIN_DATASET_EDIT_DROPDOWN_LANG_ARG_LNG;
			this.currentAbsoluteUrl = window.location.href;
			this.currentRelativeUrl = this.router.url;
			this.index = this.currentAbsoluteUrl.indexOf(this.currentRelativeUrl);
			this.baseUrl = this.currentAbsoluteUrl.substring(0, this.index);
			this.resourceOperation = false;
			
		 }

	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			try {
				this.dataset.name =  params[Constants.ROUTER_LINK_DATA_PARAM_DATASET_NAME];
			} catch (error) {
				console.error("Error: ngOnInit() params - datasets-admin-edit.component.ts");
			}
		});
		this.es = {
            firstDayOfWeek: 1,
            dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
            dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
            dayNamesMin: [ "D","L","M","X","J","V","S" ],
            monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
            monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
            today: 'Hoy',
            clear: 'Borrar'
		}
		this.filterTagsMultiple();
		if (this.dataset.name) {
			this.loadDataset(this.dataset);
		} else {
			this.initializeDataset();
		}
	}

	// Show error message if the user tries to navigate to the next tab before setting required params on previous tabs
	showErrorTab(tab){
		if(this.unlockedTabs < tab){
			this.msgs.push({severity:'warn', summary:'Error', detail: 'Completa primero las pestañas previas'});
		}
	}

	// Check geographic coverage is set
	checkGeoCoverage(){
		let valid = undefined;

		if(this.aragonRadioValue
			|| (this.provinciaRadioValue && this.provinciaInput !== undefined && this.provinciaInput !== '')
			|| (this.comarcaRadioValue && this.comarcaInput !== undefined && this.provinciaInput != '')
			|| (this.municipioRadioValue && this.municipioInput !== undefined && this.municipioInput != '')
			|| (this.otherRadioValue && this.otherInputGeo && this.otherInputGeo != '')){
			
				valid = true;
		}
		return valid;
	}
	
	// Iterate requiredObj array from init to end and show error message if array[i] is not set
	showErrorMsg(requiredObj, init, end, msg){
		for(let i=0; i<requiredObj.slice(init, end).length; i++){
			if(requiredObj[i] === undefined || requiredObj[i] === ''){
				this.msgs.push({severity:'warn', summary:'¡Atención!', detail: 'Faltan por rellenar el campo obligatorio ' + msg[i]});
			}
		}
	}

	checkTabCreationMode(){
		let msg = ['Titulo', 'Descripción', 'Temática', 'Cobertura Geográfica'];
		let requiredObj = [this.inputDatasetTitle, this.inputDatasetDescription, this.selectedTopic, this.checkGeoCoverage()];

		// Check first tab required params
		if(requiredObj.slice(0,4).every( obj => obj !== undefined && obj !== '') && requiredObj[4] == undefined){
			this.activeTab = [true, true, false];
			this.unlockedTabs = 1;
		}else{
			this.activeTab = [true, false, false];
		}
	}

	checkTab2CreationMode(){
		let msg = ['Titulo', 'Descripción', 'Temática', 'Cobertura Geográfica', 'Publicador'];
		let requiredObj = [this.inputDatasetTitle, this.inputDatasetDescription, this.selectedTopic, this.checkGeoCoverage(), this.selectedOrg];

		// Check second tab required params
		if(requiredObj.every( obj => obj !== undefined && obj !== '')){
			this.activeTab = [true, true, true];
			this.unlockedTabs = 2;
		}else{
			this.activeTab = [true, true, false];
		}
		return false;
	}

	checkTab0(){
		let msg = ['Titulo', 'Descripción', 'Temática', 'Cobertura Geográfica'];
		let requiredObj = [this.inputDatasetTitle, this.inputDatasetDescription, this.selectedTopic, this.checkGeoCoverage()];

		// Check first tab required params
		if(requiredObj.slice(0,4).every( obj => obj !== undefined && obj !== '') && requiredObj[4] == undefined){
			return true;
		}else{
			this.showErrorMsg(requiredObj, 0, 4, msg);
			return false;
		}
	}

	checkTab1(){
		let msg = ['Titulo', 'Descripción', 'Temática', 'Cobertura Geográfica', 'Publicador'];
		let requiredObj = [this.inputDatasetTitle, this.inputDatasetDescription, this.selectedTopic, this.checkGeoCoverage(), this.selectedOrg];

		// Check second tab required params
		if(requiredObj.every( obj => obj !== undefined && obj !== '')){
			return true;
		}else{
			this.showErrorMsg(requiredObj, 0, 5, msg);
		}
		return false;
	}

	// Checks that required params are set before saving dataset and enables following tabs when previous are completed
	checkAndNextTab(nextTab, save: boolean){
		this.msgs = [];

		if(this.unlockedTabs === 0){
			if(nextTab === 1){
				if(this.checkTab0()){
					this.activeTab = [true, true, false];
					this.unlockedTabs = 1;
				}
				this.checkTabCreationMode();
			}else if(nextTab === 2){
				if(this.checkTab1()){
					this.activeTab = [true, true, true];
					this.unlockedTabs = 2;
				}
				this.checkTab2CreationMode();
			}
		}else if(this.unlockedTabs === 1){
			if(nextTab === 2){
				if(this.checkTab1()){
					this.activeTab = [true, true, true];
					this.unlockedTabs = 2;
				}
			}
			this.checkTab2CreationMode();
		}else if(this.unlockedTabs === 2){
			if(this.checkTab1() && save){
				this.saveDataset(true);
			}
		}
		
		if(nextTab <= this.unlockedTabs){
			this.currentTab = nextTab;
		}
		
	}

	uploadFileTmp($event){
		if ($event.target.files[0].name.slice(-5) === '.xlsm') {
			this.mapeo_file_tmp = $event.target.files[0];			
		}else{
			this.msgs.push({severity:'warn', summary:'Error', detail:'El fichero debe ser de tipo .xlsm'});
		}
	}

	// Upload file
	uploadFile() {
		this.filesAdminService.createFile(this.mapeo_file_tmp, this.dataset.id).subscribe( response => {
			if(response.success) {
				console.log(this.mapeo_file_tmp);
				console.log(this.mapeo_file_tmp.name);
				this.mapeo_file_tmp = undefined;
				this.msgs.push({severity:'success', summary:'Fichero subido', detail:'Se ha subido el fichero con exito'});
			}else{
				console.log('Error en la petición');
			}
		});	
	}

	downloadMapFile($event) {
		this.filesAdminService.downloadFile(this.dataset.id).
		subscribe(
			response => {
				console.log(response);
				if(response.headers.get('Content-Type') === 'application/vnd.ms-excel.sheet.macroEnabled.12'){
					let url = window["config"]["AOD_BASE_URL"] + Constants.XLMS_PATH + this.dataset.id + '/mapeo_ei2a.xlsm?q=' + Date.now();
					console.log(url);
					window.open(url, '_blank');
				}else{
					this.msgs.push({severity:'warn', summary:'No se ha subido ningún fichero todavía', detail:'El dataset no contiene un fichero de mapeo.'});
				}
		});

	}

	initializeDataset() {
		this.createEmptyDataset();
		this.loadDropdowns();
	}

	createEmptyDataset() {
		this.dataset = new Dataset();
		this.dataset.extras = new Array ();
		this.dataset.groups = new Array ();
		this.dataset.tags = new Array ();
		this.extraDictionaryURL = [];
		this.extraDataQualityURL = [];
	}

	loadDropdowns() {
		this.setTopics();
		this.setOrganizations();
		this.setCoreViews();

		this.newResourceAccessTypes = [
			{ label: 'Seleccione un tipo de acceso', value: undefined },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_URL_PUBLIC_FILE.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_URL_PUBLIC_FILE.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_DATABASE_VIEW.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_DATABASE_VIEW.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_FILE.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_FILE.value }
		];
		
		this.freq = [
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_ANUAL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_ANUAL.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_SEMESTRAL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_SEMESTRAL.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_CUATRIMESTRAL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_CUATRIMESTRAL.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_TRIMESTRAL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_TRIMESTRAL.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_MENSUAL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_MENSUAL.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_DIARIA.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_DIARIA.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_INSTANTANEA.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FREQUENCY_INSTANTANEA.value },
		];
		this.accesoRecurso = [
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_LINK.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_LINK.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_DB_VIEW.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_DB_VIEW.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_FILE.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_FILE.value }
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
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ODT.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ODT.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_PNG.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_PNG.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_PS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_PS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_PX.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_PX.value },
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
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ZIP.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_ZIP.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_TTL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_FORMATS_TTL.value }
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
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_ODT.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_ODT.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_PNG.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_PNG.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_PS.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_PS.value },
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_PX.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_PX.value },
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
			{ label: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_TTL.label, value: Constants.ADMIN_DATASET_EDIT_DROPDOWN_ACCESS_MODES_TTL.value }
		];

	}
	
	loadDataset(dataset: Dataset) {
		this.activeTab = [true, true, true];
		this.unlockedTabs = 2;
		this.datasetsAdminService.getDatasetByName(dataset.name).subscribe(dataResult => {
			try {
				if(dataResult != Constants.ADMIN_DATASET_ERR_LOAD_DATASET){
					this.previouslySaved = true;
					this.datasetLoaded = true;
					this.dataset = JSON.parse(dataResult).result;
					this.inputDatasetTitle = this.dataset.title;
					this.inputDatasetUrl = this.dataset.url;
					this.inputDatasetDescription = this.dataset.notes
					if (this.dataset.private){
						this.selectedState = 'private';
					} else {
						this.selectedState = 'public';
					}
					this.getExtras();
					this.setIAESTDataset(this.dataset.maintainer);
					// GET GEO 
					if (this.dataset.groups[0] != undefined) {
						this.selectedTopic = this.dataset.groups[0].name;
					}
					if (this.extraTypeAragopedia == 'Aragón') {
						this.aragonRadioValue = true;
					}
					if (this.extraTypeAragopedia == 'Provincia') {
						this.provinciaRadioValue = true;
						if (this.extraNameAragopedia != undefined) {
							this.provinciaInput = this.extraNameAragopedia;
						}
					}
					if (this.extraTypeAragopedia == 'Comarca') {
						this.comarcaRadioValue = true;
						if (this.extraNameAragopedia != undefined) {
							this.comarcaInput = this.extraNameAragopedia;
						}
					}
					if (this.extraTypeAragopedia == 'Municipio') {
						this.municipioRadioValue = true;
						if (this.extraNameAragopedia != undefined) {
							this.municipioInput = this.extraNameAragopedia;
						}
					}
					if (this.extraTypeAragopedia == 'Otro') {
						this.otherRadioValue = true;
						if (this.extraNameAragopedia != undefined) {
							this.otherInputGeo = this.extraNameAragopedia;
						}
					}
	
					this.tags = this.dataset.tags;
					this.loadResources();
					this.loadDropdowns();

					this.filesAdminService.downloadFile(this.dataset.id).
					subscribe(
						response => {
							console.log(response);
							if(response.headers.get('Content-Type') === 'application/vnd.ms-excel.sheet.macroEnabled.12'){
								this.showMapLink = true;
							}
					});
					
				}else{
					this.disableButtons();
				}
			} catch (error) {
				console.error("Error: loadDataset() - datasets-admin-edit.component.ts");
			}
		});
	}

	disableButtons(){
		jQuery("#saveAndContinueB").prop("disabled",true);
		jQuery("#saveAndFinishB").prop("disabled",true);
	}

	loadResources(){
		this.resources = [];
		for (var index = 0; index < this.dataset.resources.length; index++) {
			this.resource = new Resource();
			this.resource = this.dataset.resources[index];
			this.resources = [...this.resources, this.resource];
		}
	}
	
	createUrl(){
		if(!this.datasetLoaded){
			if (this.inputDatasetTitle != undefined) {
				let url = this.inputDatasetTitle.toLocaleLowerCase().trim( ).split(/\s+/).join('-').split('ñ').join('ny')
				.split('á').join('a').split('é').join('e').split('í').join('i').split('ó').join('o').split('ú').join('u')
				.split('ä').join('a').split('ë').join('e').split('ï').join('i').split('ö').join('o').split('ü').join('u')
				.split(',').join('');
				this.inputDatasetUrl = encodeURI(url);
			}
		}
		this.checkTabCreationMode();
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

	setCoreViews() {
		this.coreViewsSelect = [];
		this.coreViewsSelect.push({ label: 'Seleccione una vista', value: undefined });
		this.aodCoreAdminService.getViews().subscribe(views => {
			try {
				let coreView = views;
				for (let view of coreView) {
					this.coreViewsSelect.push({ label: view[1], value: view[0] });
				}
			} catch (error) {
				console.error('Error: setCoreViews() - datasets-admin-edit.component.ts');
			}
		});
	}

	addUrl(type: string, url: string){
		try {
			if(type === 'quality'){
				if (this.validateURL(url)) {
					this.extraDataQualityURL.push(url);
				} else {
					this.msgs.push({severity:'error', summary:'URL no válida', detail: 'La URL introducida no es válida.'});
				}
			}else{
				if (this.validateURL(url)) {
					this.extraDictionaryURL.push(url);
				} else {
					this.msgs.push({severity:'error', summary:'URL no válida', detail: 'La URL introducida no es válida.'});
				}
			}
		} catch (error) {
			console.error('Error: addUrl() - datasets-admin-edit.component.ts');
		}
	}

	removeUrl(type: string, originalUrl: string){
		let orgUrl = '';
		let delUrl = '';
		if(type === 'quality'){
			for (var i = 0; i < this.extraDataQualityURL.length; i++) {
				orgUrl = this.extraDataQualityURL[i];
				delUrl = originalUrl;
				if(delUrl == orgUrl){
					this.extraDataQualityURL.splice(i,1);
				}
			}
		}else{
			for (var i = 0; i < this.extraDictionaryURL.length; i++) {
				orgUrl = this.extraDictionaryURL[i];
				delUrl = originalUrl;
				if(delUrl == orgUrl){
					this.extraDictionaryURL.splice(i,1);
				}
			}
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
		try {
			this.extraDictionaryURL = [];
			this.extraDataQualityURL = [];
			for (var index = 0; index < this.dataset.extras.length; index++) {
				if (this.dataset.extras[index].key.indexOf(Constants.DATASET_EXTRA_DATA_DICTIONARY_URL) == 0) {
					this.extraDictionaryURL.push(this.dataset.extras[index].value);					
				}
				if (this.dataset.extras[index].key.indexOf(Constants.DATASET_EXTRA_DATA_QUALITY_URL) == 0) {
					this.extraDataQualityURL.push(this.dataset.extras[index].value);					
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
					case Constants.DATASET_EXTRA_SPATIAL:
						if(!this.extraGranularity){
							this.extraGranularity = this.dataset.extras[index].value;
						}
						break;
					case Constants.DATASET_EXTRA_TEMPORAL_FROM:
						this.extraTemporalFrom = this.dataset.extras[index].value;
						break;
					case Constants.DATASET_EXTRA_TEMPORAL_UNTIL:
						this.extraTemporalUntil=  this.dataset.extras[index].value;
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
					case Constants.DATASET_EXTRA_LANG_ES:
						this.checkLangBoolEs = true;
						break;
					case Constants.DATASET_EXTRA_LANG_EN:
						this.checkLangBoolEn = true;
						break;
					case Constants.DATASET_EXTRA_LANG_FR:
						this.checkLangBoolFr = true;
						break;
					case Constants.DATASET_EXTRA_LANG_ARG:
						this.checkLangBoolArg_Lng = true;
						break;
					case Constants.DATASET_EXTRA_LANG_OTHER:
						this.checkLangOther = this.dataset.extras[index].value;
						this.checkLangBoolOther = true;
						break;
					case Constants.DATASET_EXTRA_IAEST_TEMA_ESTADISTICO:
						this.extraIAESTTemaEstadistico = this.dataset.extras[index].value;
						break;
					case Constants.DATASET_EXTRA_IAEST_UNIDAD_ESTADISTICA:
						this.extraIAESTUnidadEstadistica = this.dataset.extras[index].value;
						break;
					case Constants.DATASET_EXTRA_IAEST_POBLACION_ESTADISTICA:
						this.extraIAESTPoblacionEstadistica = this.dataset.extras[index].value;
						break;
					case Constants.DATASET_EXTRA_IAEST_UNIDAD_MEDIDA:
						this.extraIAESTUnidadMedida = this.dataset.extras[index].value;
						break;
					case Constants.DATASET_EXTRA_IAEST_PERIODO_BASE:
						this.extraIAESTPeriodoBase = this.dataset.extras[index].value;
						break;
					case Constants.DATASET_EXTRA_IAEST_TIPO_OPERACION:
						this.extraIAESTTipoOperacion = this.dataset.extras[index].value;
						break;
					case Constants.DATASET_EXTRA_IAEST_TIPOLOGIA_DATOS_ORIGEN:
						this.extraIAESTTipologiaDatosOrigen = this.dataset.extras[index].value;
						break;
					case Constants.DATASET_EXTRA_IAEST_FUENTE:
						this.extraIAESTFuente = this.dataset.extras[index].value;
						break;
					case Constants.DATASET_EXTRA_IAEST_TRATAMIENTO_ESTADISTICO:
						this.extraIAESTTratamientoEstadistico = this.dataset.extras[index].value;
						break;
					case Constants.DATASET_EXTRA_IAEST_LEGISLACION_UE:
						this.extraIAESTLegislacionUE = this.dataset.extras[index].value;
						break;
				}
			}
		
			for (var index = 0; index < this.extraDictionaryURL.length; index++) {
				this.deleteExtraByValue(this.extraDictionaryURL[index]);
			}
			for (var index = 0; index < this.extraDataQualityURL.length; index++) {
				this.deleteExtraByValue(this.extraDataQualityURL[index]);
			}
		} catch (error) {
			console.error('Error: getExtras() - datasets-admin-edit.component.ts');
		}
	}

	setIAESTDataset(maintainer: string) {
		if (maintainer === Constants.DATASET_EXTRA_IAEST_MAINTAINER) {
			this.isIAESTDataset = true;
		}
	}

	replaceExtra(extra_key: string, extra_value: string, create: boolean){
		let obj = this.dataset.extras.find((extra, i) => {
			if (extra.key === extra_key) {
				this.dataset.extras[i] = { key: extra_key, value: extra_value };
				return true; // stop searching
			}
		});
		if ( create && obj == undefined){
			this.addExtra(extra_key, extra_value);
		}
	}

	deleteExtra(extra_key: string){
		let obj = this.dataset.extras.find((extra, i) => {
			if (extra.key === extra_key) {
				this.dataset.extras.splice(i,1);
				return true; // stop searching
			}
		});
	}

	deleteExtraByValue(extra_value: string){
		let obj = this.dataset.extras.find((extra, i) => {
			if (extra.value === extra_value) {
				this.dataset.extras.splice(i,1);
				return true; // stop searching
			}
		});
	}

	addExtra(extra_key: string, extra_value: string){
		this.dataset.extras.push({ key: extra_key, value: extra_value });
	}

	changeCheckBoxLang(lang: string){

		switch (lang) {
			case Constants.ADMIN_DATASET_EDIT_DROPDOWN_LANG_ES:
				if (this.checkLangBoolEs){
					this.checkLangBoolEs = false;
				} else {
					this.checkLangBoolEs = true;
				}
				break;
			case Constants.ADMIN_DATASET_EDIT_DROPDOWN_LANG_EN:
				if (this.checkLangBoolEn){
					this.checkLangBoolEn = false;
				} else {
					this.checkLangBoolEn = true;
				}
				break;
			case Constants.ADMIN_DATASET_EDIT_DROPDOWN_LANG_FR:
				if (this.checkLangBoolFr){
					this.checkLangBoolFr = false;
				} else {
					this.checkLangBoolFr = true;
				}
				break;
			case Constants.ADMIN_DATASET_EDIT_DROPDOWN_LANG_ARG_LNG:
				if (this.checkLangBoolArg_Lng){
					this.checkLangBoolArg_Lng = false;
				} else {
					this.checkLangBoolArg_Lng = true;
				}
				break;
			case Constants.ADMIN_DATASET_EDIT_DROPDOWN_LANG_OTHER:
				if (this.checkLangBoolOther){
					this.checkLangBoolOther = false;
					this.checkLangOther = undefined;
				} else {
					this.checkLangBoolOther = true;
				}
				break;
		}

	}

	changeRadioGeo(type: string){

		this.aragonRadioValue = false;
		this.provinciaRadioValue = false;
		this.comarcaRadioValue = false;
		this.municipioRadioValue = false;
		this.otherRadioValue = false;

		this.provinciaInput = undefined;
		this.comarcaInput = undefined;
		this.municipioInput = undefined;
		this.otherInputGeo = undefined;

		switch (type) {
			case 'aragon':
				this.aragonRadioValue = true;
				this.extraTypeAragopedia = 'Aragón';
				this.extraNameAragopedia = 'Aragón';
				this.extraShortUriAragopedia = 'Aragón';
				this.extraUriAragopedia =  this.baseUrl+'/recurso/territorio/ComunidadAutonoma/Aragón';
				break;
			case 'provincia':
				this.provinciaRadioValue = true;
				this.extraTypeAragopedia = 'Provincia';
				this.extraNameAragopedia = this.provinciaInput;
				this.extraShortUriAragopedia = this.provinciaInput;
				this.extraUriAragopedia = this.baseUrl+'/recurso/territorio/Provincia/'+this.provinciaInput;
				break;
			case 'comarca':
				this.comarcaRadioValue = true;
				this.extraTypeAragopedia = 'Comarca';
				this.extraNameAragopedia = this.comarcaInput;
				this.extraShortUriAragopedia = this.comarcaInput;
				this.extraUriAragopedia = this.baseUrl+'/recurso/territorio/Comarca/'+this.comarcaInput;
				break;
			case 'municipio':
				this.municipioRadioValue = true;
				this.extraTypeAragopedia = 'Municipio';
				this.extraNameAragopedia = this.municipioInput;
				this.extraShortUriAragopedia = this.municipioInput;
				this.extraUriAragopedia = this.baseUrl+'/recurso/territorio/Municipio/'+this.municipioInput;
				break;
			case 'otro':
				this.otherRadioValue = true;
				this.extraTypeAragopedia = 'Otro';
				this.extraNameAragopedia = this.otherInputGeo;
				this.extraShortUriAragopedia = this.otherInputGeo;
				this.extraUriAragopedia = undefined;
				break;
		
			default:
				break;
		}
		this.checkTabCreationMode();

	}

	updateGeoExtras() {

		if (this.aragonRadioValue) {
			this.extraTypeAragopedia = 'Aragón';
			this.extraNameAragopedia = 'Aragón';
			this.extraShortUriAragopedia = 'Aragón';
			this.extraUriAragopedia =  this.baseUrl+'/recurso/territorio/ComunidadAutonoma/Aragón';
		}
		if (this.provinciaRadioValue) {
			this.extraTypeAragopedia = 'Provincia';
			this.extraNameAragopedia = this.provinciaInput;
			this.extraShortUriAragopedia = this.provinciaInput;
			this.extraUriAragopedia = this.baseUrl+'/recurso/territorio/Provincia/'+this.provinciaInput;
		}
		if (this.comarcaRadioValue) {
			this.extraTypeAragopedia = 'Comarca';
			this.extraNameAragopedia = this.comarcaInput;
			this.extraShortUriAragopedia = this.comarcaInput;
			this.extraUriAragopedia = this.baseUrl+'/recurso/territorio/Comarca/'+this.comarcaInput;
		}
		if (this.municipioRadioValue) {
			this.extraTypeAragopedia = 'Municipio';
			this.extraNameAragopedia = this.municipioInput;
			this.extraShortUriAragopedia = this.municipioInput;
			this.extraUriAragopedia = this.baseUrl+'/recurso/territorio/Municipio/'+this.municipioInput;
		}
		if (this.otherRadioValue) {
			this.extraTypeAragopedia = 'Otro';
			this.extraNameAragopedia = this.otherInputGeo;
			this.extraShortUriAragopedia = this.otherInputGeo;
			this.extraUriAragopedia = undefined;
		}

	}

	delTag(tag_name: string) {
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

	checkResource() {
		let valid = true;

		if (this.newResourceAccessType != undefined) {
			switch (this.newResourceAccessType) {
				case this.newResourceAccessTypePublicFile:
					if ( this.newResourceUrl == undefined || this.newResourceUrl == '' || this.newResourceFormat == undefined || this.newResourceFormat == '' 
						|| this.newResourceName == undefined  || this.newResourceName == '' || this.newResourceDescription == undefined || this.newResourceDescription == '' ) {
						return false;
					}
				break;

				case this.newResourceAccessTypeDatabaseView:
					if ( this.selectedCoreView == undefined || this.selectedCoreView == '' || this.newResourceName == undefined  || this.newResourceName == '' 
						|| this.newResourceDescription == undefined || this.newResourceDescription == '' ) {
						return false;
					} 
				break;

				case this.newResourceAccessTypeFile:
					if ( !this.fileList || this.fileList.length == 0 || this.newResourceFormat == undefined || this.newResourceFormat == '' 
						|| this.newResourceName == undefined || this.newResourceName == '' || this.newResourceDescription == undefined || this.newResourceDescription == '' ) {
						return false;
					}
				break;
			}
		} else {
			return false;
		}
		
		return valid;
	}

	resetAddResourceModal() {

		if(!this.previouslySaved){
			this.saveDataset(false);
		}

		this.newResourceAccessType = undefined;
		this.newResourceUrl = undefined;
		this.selectedCoreView = undefined;
		this.newResourceDescription = undefined;
		this.newResourceName = undefined;
		this.newResourceFormat = undefined;
		this.fileList = undefined;
		this.msgs = [];
	}

	fileChange(event) {
		this.fileList = event.target.files;
	}

	addResource() {
		try {
			if (this.checkResource()){
				if(this.previouslySaved) {
					switch (this.newResourceAccessType) {
						case this.newResourceAccessTypePublicFile:
							let resource = {
								resource_type: 'url',
								package_id: this.dataset.id,
								format: this.formatos[this.newResourceFormat].label,
								description: this.newResourceDescription,
								name: this.newResourceName,
								url: this.newResourceUrl
							}
							
							//CALL TO POST METHOD ON SERVICE
							this.datasetsAdminService.createResource(null, resource).subscribe( response => {
								if( response.success) {
									this.msgs.push({severity:'success', summary:'Recurso Creado', detail:'Se ha creado el Recurso con exito'});
									jQuery('#modalAddResource').modal('hide')
									this.loadDataset(this.dataset);
									this.resetAddResourceModal();
								}
							});	
						break;
		
						case this.newResourceAccessTypeDatabaseView:
							let viewResource = {
								resource_type: 'view',
								package_id: this.dataset.id,
								description: this.newResourceDescription,
								name: this.newResourceName,
								view_id: this.selectedCoreView
							}
	
							//CALL TO POST METHOD ON SERVICE
							this.datasetsAdminService.createResource(null, viewResource).subscribe( response => {
								if( response.success) {
									this.msgs.push({severity:'success', summary:'Recurso Creado', detail:'Se ha creado el Recurso con exito'});
									jQuery('#modalAddResource').modal('hide')
									this.loadDataset(this.dataset)
									this.resetAddResourceModal();
								}
							});
							 
						break;
		
						case this.newResourceAccessTypeFile:
							if(this.fileList.length > 0) {
								let file: File = this.fileList[0];
								let resource = {
									file: file,
									resource_type: 'file',
									package_id: this.dataset.id,
									format: this.formatos[this.newResourceFormat].label,
									description: this.newResourceDescription,
									name: this.newResourceName
								}
	
								//CALL TO POST METHOD ON SERVICE
								this.datasetsAdminService.createResource(file, resource).subscribe( response => {
									if( response.success) {
										this.msgs.push({severity:'success', summary:'Recurso Creado', detail:'Se ha creado el Recurso con exito'});
										jQuery('#modalAddResource').modal('hide')
										this.loadDataset(this.dataset)
										this.resetAddResourceModal();
									}
								});
							}	
						break;
					}
				}else{
					console.log('Dataset not saved');
				}
			} else {
				this.msgs.push({severity:'warn', summary:'No se puede crear el recurso', detail:'Faltan campos por rellenar para añadir el recurso'});
			}
		} catch (error) {
			console.error('Error addResource() - datasets-admin-edit.component.ts');
		}
	}

	openRemoveResource(resource: any) {
		this.resource = resource;
	}
	
	checkDatasetInsertparams () {
		let valid = false;

		if (this.inputDatasetTitle != undefined && this.inputDatasetDescription != undefined && this.selectedOrg != undefined
			&& this.selectedTopic != undefined ) {
			valid = true;
		} else {
			// this.msgs = [];
			// this.msgs.push({severity:'warn', summary:'¡Atención!', detail: 'Faltan por rellenar campos obligatorios'});
		}
		return valid;
	}

	addTag(tag: Tag){
		this.tags.push(tag);
		this.datasetTags = null;
	}

	addNewTag(newTag: string){
		let newTagObj = new Array<Tag>();
		let auxTag = newTag.split(",");
		for(let index = 0; index < auxTag.length; index++){
			newTagObj[index] = new Tag;
			newTagObj[index].display_name = auxTag[index].trim();
			newTagObj[index].name = auxTag[index].trim();
			this.tags.push(newTagObj[index]);
		}
		this.tagValue = "";
		this.datasetTags = null;
	}

	search(title: string): void {
		//Lectura cuando hay al menos 3 caracteres, (3 espacios produce error).
		if (title.length >= Constants.DATASET_AUTOCOMPLETE_MIN_CHARS) {
			this.tagTitle.next(title);
		} else {
			this.datasetTags = null;
		}
	}

	filterTagsMultiple(): void {
		//Funciona la busqueda, falla al poner un caracter especial
		this.tagTitle
			.pipe(debounceTime(Constants.DATASET_AUTOCOMPLETE_DEBOUNCE_TIME))
			.pipe(distinctUntilChanged())
			.pipe(switchMap(query => query
				? this.datasetsAdminService.getTags(query)
				: Observable.of<Tag[]>([])))
			.pipe(catchError(error => {
				console.error(error);
				return Observable.of<Tag[]>([]);
			})).subscribe(tags => {
				try {
					this.datasetTags = <Tag[]>(tags).result;	
				} catch (error) {
					console.error("Error: filterTagsMultiple() - datasets-admin-edit.component.ts");
				}
				
			});
	}

	addMapFileToExtraDictionary(save) {
		let url = window["config"]["AOD_BASE_URL"] + Constants.XLMS_PATH + this.dataset.id + '/mapeo_ei2a.xlsm';
		console.log(url);
		if(this.extraDictionaryURL.findIndex(item => item === url) === -1){
			console.log('Adding ' + url + ' to extraDictionaryURL');
			this.extraDictionaryURL.push(url);
			console.log(this.extraDictionaryURL);		
		}

		if(save){
			this.saveDataset(false);
		}

	}
	
	uploadMapFile(){
		if(this.mapeo_file_tmp !== undefined){

			if(this.dataset.id === undefined){
				this.datasetsAdminService.getDatasetByName(this.dataset.name).subscribe(dataResult => {
					try {
						if(dataResult != Constants.ADMIN_DATASET_ERR_LOAD_DATASET){
							this.dataset = JSON.parse(dataResult).result;
							this.uploadFile();
							//this.addMapFileToExtraDictionary(true);
						}
					}catch (error) {
						console.error(error);
					}
				});
			}else{
				this.uploadFile();
				//this.addMapFileToExtraDictionary(false);
			}
		}
	}

	// Call when you click Save Button
	// Warning: Option false will set autoSaved = true
	saveDataset(option: boolean){
		if(!this.previouslySaved){
			this.saveDatasetAdd(option);
		}else if(this.dataset.name){
			this.saveDatasetUpdate(option);
		}
	}

	saveDatasetAdd(option: boolean){
		console.log('Save ADD');
		this.createEmptyDataset();
		try {
			if (this.checkDatasetInsertparams()) {
				//Name and Description TAB
				this.dataset.title = this.inputDatasetTitle;
				this.dataset.notes = this.inputDatasetDescription;
				this.dataset.url = this.baseUrl + '/' + Constants.ROUTER_LINK_DATA_CATALOG_DATASET + '/' + this.inputDatasetUrl;
				this.dataset.name = this.inputDatasetUrl;
				console.log(this.dataset.name);
				//Groups And Tags TAB
				this.dataset.tags = this.tags;

				if (this.selectedState == 'private'){
					this.dataset.private = true;
				}

				this.updateGeoExtras();
				//Geographic coverage TAB
				if (this.extraNameAragopedia != undefined ){
					this.addExtra(Constants.DATASET_EXTRA_NAME_ARAGOPEDIA, this.extraNameAragopedia);
				}
				if (this.extraShortUriAragopedia != undefined ){
					this.addExtra(Constants.DATASET_EXTRA_SHORT_URI_ARAGOPEDIA, this.extraShortUriAragopedia);
				}
				if (this.extraTypeAragopedia != undefined ){
					this.addExtra(Constants.DATASET_EXTRA_TYPE_ARAGOPEDIA, this.extraTypeAragopedia);
				}
				if (this.extraUriAragopedia != undefined ){
					this.addExtra(Constants.DATASET_EXTRA_URI_ARAGOPEDIA, this.extraUriAragopedia);
				}

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
				if (this.checkLangBoolEs) {
					this.addExtra(Constants.DATASET_EXTRA_LANG_ES, this.checkLangEs);
				}
				if (this.checkLangBoolEn) {
					this.addExtra(Constants.DATASET_EXTRA_LANG_EN, this.checkLangEn);
				}
				if (this.checkLangBoolFr) {
					this.addExtra(Constants.DATASET_EXTRA_LANG_FR, this.checkLangFr);
				}
				if (this.checkLangBoolArg_Lng) {
					this.addExtra(Constants.DATASET_EXTRA_LANG_ARG, this.checkLangArg_Lng);
				}
				if (this.checkLangBoolOther) {
					this.addExtra(Constants.DATASET_EXTRA_LANG_OTHER, this.checkLangOther);
				}

				//EXTRAS TAB
				if (this.extraGranularity != undefined){
					this.addExtra(Constants.DATASET_EXTRA_GRANULARITY, this.extraGranularity);
				}
				if (this.extraDataQuality != undefined){
					this.addExtra(Constants.DATASET_EXTRA_DATA_QUALITY, this.extraDataQuality);
				}
					//TODO DATA QUALITY EXTERNAL LINK??
				if (this.extraDictionary != undefined){
					this.addExtra(Constants.DATASET_EXTRA_DATA_DICTIONARY, this.extraDictionary);
				}
				if (this.extraDictionaryURL.length > 0) {
					for (var i = 0; i < this.extraDictionaryURL.length; i++) {
						this.addExtra(Constants.DATASET_EXTRA_DATA_DICTIONARY_URL+i, this.extraDictionaryURL[i]);
					}
				}
				if (this.extraDataQualityURL.length > 0) {
					for (var i = 0; i < this.extraDataQualityURL.length; i++) {
						this.addExtra(Constants.DATASET_EXTRA_DATA_QUALITY_URL+i, this.extraDataQualityURL[i]);
					}
				}

				// EXTRAS IAEST TAB
				if (this.extraIAESTTemaEstadistico != undefined){
					this.addExtra(Constants.DATASET_EXTRA_IAEST_TEMA_ESTADISTICO, this.extraIAESTTemaEstadistico);
				}
				if (this.extraIAESTUnidadEstadistica != undefined){
					this.addExtra(Constants.DATASET_EXTRA_IAEST_UNIDAD_ESTADISTICA, this.extraIAESTUnidadEstadistica);
				}
				if (this.extraIAESTPoblacionEstadistica != undefined){
					this.addExtra(Constants.DATASET_EXTRA_IAEST_POBLACION_ESTADISTICA, this.extraIAESTPoblacionEstadistica);
				}
				if (this.extraIAESTUnidadMedida != undefined){
					this.addExtra(Constants.DATASET_EXTRA_IAEST_UNIDAD_MEDIDA, this.extraIAESTUnidadMedida);
				}
				if (this.extraIAESTPeriodoBase != undefined){
					this.addExtra(Constants.DATASET_EXTRA_IAEST_PERIODO_BASE, this.extraIAESTPeriodoBase);
				}
				if (this.extraIAESTTipoOperacion != undefined){
					this.addExtra(Constants.DATASET_EXTRA_IAEST_TIPO_OPERACION, this.extraIAESTTipoOperacion);
				}
				if (this.extraIAESTTipologiaDatosOrigen != undefined){
					this.addExtra(Constants.DATASET_EXTRA_IAEST_TIPOLOGIA_DATOS_ORIGEN, this.extraIAESTTipologiaDatosOrigen);
				}
				if (this.extraIAESTFuente != undefined){
					this.addExtra(Constants.DATASET_EXTRA_IAEST_FUENTE, this.extraIAESTFuente);
				}
				if (this.extraIAESTTratamientoEstadistico != undefined){
					this.addExtra(Constants.DATASET_EXTRA_IAEST_TRATAMIENTO_ESTADISTICO, this.extraIAESTTratamientoEstadistico);
				}
				if (this.extraIAESTLegislacionUE != undefined){
					this.addExtra(Constants.DATASET_EXTRA_IAEST_LEGISLACION_UE, this.extraIAESTLegislacionUE);
				}

				//LICENSE AND ORGANIZATION TAB
				this.dataset.license_id = Constants.ADMIN_DATASET_EDIT_LICENSE_ID_DEFAULT;
				this.dataset.license_title = Constants.ADMIN_DATASET_EDIT_LICENSE_TITLE_DEFAULT;
				this.dataset.license_url = Constants.ADMIN_DATASET_EDIT_LICENSE_URL_DEFAULT;
				this.dataset.owner_org = this.selectedOrg;
				
				//OTHER PARAMS
				this.dataset.private = false;
				this.dataset.state = "active";

				//Add User Info
				let datasetNew: any = this.dataset;
				datasetNew.groups.push({name: this.selectedTopic})
				datasetNew.requestUserId = this.usersAdminService.currentUser.id;
				datasetNew.requestUserName = this.usersAdminService.currentUser.username;
				
				//CALL TO POST METHOD ON SERVICE
				this.datasetsAdminService.createDataset(datasetNew).subscribe( response => {
					this.msgs = [];
					if(response.status == 409){
						this.msgs.push({severity:'warn', summary:response.errorTitle, detail:response.errorDetail});
					}
					if(response.status == 400){
						this.msgs.push({severity:'warn', summary:response.errorTitle, detail:response.errorDetail});
					}
					if(response.status == 200){
						this.msgs.push({severity:'success', summary:'Dataset Creado', detail:'Se ha creado el Dataset con exito'});
						this.previouslySaved = true;
						this.uploadMapFile();
						if(option){
							setTimeout(() => this.router.navigate(['/' + this.routerLinkDatasetList]), 1500)
						}else{
							this.autoSaved = true;
							this.loadDataset(this.dataset);
						}
					}
				});
			}
		} catch (error) {
			console.error(error);
			console.error('Error saveDatasetAdd() - datasets-admin-edit.component.ts');
		}
	}

	saveDatasetUpdate(option: boolean){
		console.log('Save Update');
		try {
			this.dataset.title = this.inputDatasetTitle;
			this.dataset.notes = this.inputDatasetDescription;
			if(this.selectedOrg!=undefined){
				this.dataset.organization = this.orgs.find(x => x.id === this.selectedOrg);
				this.dataset.owner_org = this.selectedOrg;
			}
			this.dataset.license_id = Constants.ADMIN_DATASET_EDIT_LICENSE_ID_DEFAULT;
			this.dataset.license_title = Constants.ADMIN_DATASET_EDIT_LICENSE_TITLE_DEFAULT;
			this.dataset.license_url = Constants.ADMIN_DATASET_EDIT_LICENSE_URL_DEFAULT;
			if (this.selectedState == 'private'){
				this.dataset.private = true;
			} else {
				this.dataset.private = false;
			}
			this.dataset.state = "active";
			this.dataset.owner_org = this.selectedOrg;
	
			if(this.extraFrequency){
				this.replaceExtra(Constants.DATASET_EXTRA_FREQUENCY,this.extraFrequency, true)
			}
			if (this.extraTemporalUntil != undefined) {
				this.replaceExtra(Constants.DATASET_EXTRA_TEMPORAL_UNTIL, this.extraTemporalUntil, true)
			}
			if (this.extraTemporalFrom != undefined) {
				this.replaceExtra(Constants.DATASET_EXTRA_TEMPORAL_FROM, this.extraTemporalFrom, true)
			}
	
			//LANGUAGES TAB
			if (this.checkLangBoolEs) {
				this.replaceExtra(Constants.DATASET_EXTRA_LANG_ES, this.checkLangEs, true);
			} else {
				this.deleteExtra(Constants.DATASET_EXTRA_LANG_ES);
			}
			if (this.checkLangBoolEn) {
				this.replaceExtra(Constants.DATASET_EXTRA_LANG_EN, this.checkLangEn, true);
			} else {
				
				this.deleteExtra(Constants.DATASET_EXTRA_LANG_EN);
			}
			if (this.checkLangBoolFr) {
				this.replaceExtra(Constants.DATASET_EXTRA_LANG_FR, this.checkLangFr, true);
			} else {
				this.deleteExtra(Constants.DATASET_EXTRA_LANG_FR);
			}
			if (this.checkLangBoolArg_Lng) {
				this.replaceExtra(Constants.DATASET_EXTRA_LANG_ARG, this.checkLangArg_Lng, true);
			} else {
				this.deleteExtra(Constants.DATASET_EXTRA_LANG_ARG);
			}
			if (this.checkLangBoolOther) {
				this.replaceExtra(Constants.DATASET_EXTRA_LANG_OTHER, this.checkLangOther, true);
			} else {
				this.deleteExtra(Constants.DATASET_EXTRA_LANG_OTHER);
			}
	
			this.updateGeoExtras();
			//Geographic coverage TAB
			if (this.extraNameAragopedia != undefined ){
				this.replaceExtra(Constants.DATASET_EXTRA_NAME_ARAGOPEDIA, this.extraNameAragopedia, true);
			}
			if (this.extraShortUriAragopedia != undefined ){
				this.replaceExtra(Constants.DATASET_EXTRA_SHORT_URI_ARAGOPEDIA, this.extraShortUriAragopedia, true);
			}
			if (this.extraTypeAragopedia != undefined ){
				this.replaceExtra(Constants.DATASET_EXTRA_TYPE_ARAGOPEDIA, this.extraTypeAragopedia, true);
			}
			if (this.extraUriAragopedia != undefined ){
				this.replaceExtra(Constants.DATASET_EXTRA_URI_ARAGOPEDIA, this.extraUriAragopedia, true);
			}
	
			//EXTRAS TAB
			if (this.extraGranularity != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_GRANULARITY, this.extraGranularity, true);
			}
			if (this.extraDataQuality != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_DATA_QUALITY, this.extraDataQuality, true);
			}
			//TODO DATA QUALITY EXTERNAL LINK??
			if (this.extraDictionary != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_DATA_DICTIONARY, this.extraDictionary, true);
			}
			if (this.extraDictionaryURL.length > 0) {
				for (var i = 0; i < this.extraDictionaryURL.length; i++) {
					this.addExtra(Constants.DATASET_EXTRA_DATA_DICTIONARY_URL+i, this.extraDictionaryURL[i]);
				}
			}
			if (this.extraDataQualityURL.length > 0) {
				for (var i = 0; i < this.extraDataQualityURL.length; i++) {
					this.addExtra(Constants.DATASET_EXTRA_DATA_QUALITY_URL+i, this.extraDataQualityURL[i]);
				}
			}

			// EXTRAS IAEST TAB
			if (this.extraIAESTTemaEstadistico != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_IAEST_TEMA_ESTADISTICO, this.extraIAESTTemaEstadistico, true);
			}
			if (this.extraIAESTUnidadEstadistica != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_IAEST_UNIDAD_ESTADISTICA, this.extraIAESTUnidadEstadistica, true);
			}
			if (this.extraIAESTPoblacionEstadistica != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_IAEST_POBLACION_ESTADISTICA, this.extraIAESTPoblacionEstadistica, true);
			}
			if (this.extraIAESTUnidadMedida != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_IAEST_UNIDAD_MEDIDA, this.extraIAESTUnidadMedida, true);
			}
			if (this.extraIAESTPeriodoBase != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_IAEST_PERIODO_BASE, this.extraIAESTPeriodoBase, true);
			}
			if (this.extraIAESTTipoOperacion != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_IAEST_TIPO_OPERACION, this.extraIAESTTipoOperacion, true);
			}
			if (this.extraIAESTTipologiaDatosOrigen != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_IAEST_TIPOLOGIA_DATOS_ORIGEN, this.extraIAESTTipologiaDatosOrigen, true);
			}
			if (this.extraIAESTFuente != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_IAEST_FUENTE, this.extraIAESTFuente, true);
			}
			if (this.extraIAESTTratamientoEstadistico != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_IAEST_TRATAMIENTO_ESTADISTICO, this.extraIAESTTratamientoEstadistico, true);
			}
			if (this.extraIAESTLegislacionUE != undefined){
				this.replaceExtra(Constants.DATASET_EXTRA_IAEST_LEGISLACION_UE, this.extraIAESTLegislacionUE, true);
			}
			
			let datasetUpdated: any = this.dataset;
			datasetUpdated.requestUserId = this.usersAdminService.currentUser.id;
			datasetUpdated.requestUserName = this.usersAdminService.currentUser.username;
			datasetUpdated.groups = [];
			datasetUpdated.groups.push({name: this.selectedTopic})
			this.datasetsAdminService.updateDataset(datasetUpdated).subscribe( response => {
				this.msgs = [];
				
				if(response.status == 200){
					this.msgs.push({severity:'success', summary:'Dataset Actualizado', detail:'Se ha actualizado el Dataset con exito'});
					this.uploadMapFile();
					if(option){
						setTimeout(() => this.router.navigate(['/' + this.routerLinkDatasetList]), 1500)
					}else{
						this.loadDataset(this.dataset);
					}
				}
				if(response.status == 409){
					this.msgs.push({severity:'warn', summary:response.errorTitle, detail:response.errorDetail});
				} else if (response.status != 200) {
					this.msgs.push({severity:'warn', summary:response.errorTitle, detail:response.errorDetail});
				}
			
	
			});
			
		} catch (error) {
			console.error('Error saveDatasetUpdate() - datasets-admin-edit.component.ts');
		}
	}

	showCancelDialog(datasetTitle: string, datasetName: string){
		if(this.autoSaved){
			this.displayAutoSavedDeleteDialog = true;
		}else{
			this.displayDeleteDialog = true;
		}
		this.datasetTitleDelete = datasetTitle;
		this.datasetNameToDelete = datasetName;	

	}
	
	deleteDatasetAndExit(){
		this.datasetsAdminService.removeDataset(this.dataset.name,
									this.usersAdminService.currentUser.username,
									this.usersAdminService.currentUser.id,
									this.dataset.id).subscribe(
										resource =>{
											this.cancelDataset();
										});
	}

    cancelDataset(){
		this.displayDeleteDialog=false;
		this.router.navigate(['/' + this.routerLinkDatasetList]); 
    }

    undoCancelDataset(){
        this.displayDeleteDialog=false;
        this.datasetNameToDelete = undefined;
	}
	
	deleteResource(){
		try {
			this.displayDeleteDialog=false;
			this.datasetsAdminService.removeResource(this.resource.id).subscribe( response => {
				if (response.status == 200) {
					this.msgs = [];
					this.loadDataset(this.dataset);
					jQuery('#modalRemoveResource').modal('hide')
					this.msgs.push({severity:'success', summary:'Recurso Borrado', detail:'Recurso borrado correctamente'});
				}
			});
		} catch (error) {
			console.error('Error deleteResource() - datasets-admin-edit.component.ts');
			this.msgs.push({severity:'warn', summary:'Error al borrar', detail:'Ha ocurrido un error borrando el Recurso'});
		}
    }

    undoDeleteResource(){
		this.resource = undefined;
        this.displayDeleteDialog=false;
        this.datasetNameToDelete = undefined;
	}
	
	openEditResource(resource: any){
		this.resource = resource;
		this.getTypeResource();
	}

	openShowResource(resource: any){
		this.resource = resource;
		this.getTypeResource();
	}

	updateResource(){
		try {
			this.resourceOperation = true;
			let resourceUpdated: any = this.resource;
			let file = null;
			if (this.fileList) {
				file = this.fileList[0];
			}
			this.datasetsAdminService.updateResource(resourceUpdated, file).subscribe( response => {
				this.resourceOperation = false;
				if( response.success){
					this.msgs.push({severity:'success', summary:'Recurso Actualizado', detail:'Se ha actualizado el Recurso con exito'});
					this.resource = undefined;
					jQuery('#modalEditResource').modal('hide')
					this.loadDataset(this.dataset);
				}
			});
		} catch (error) {
			console.error('Error updateResource() - datasets-admin-edit.component.ts');
			this.msgs.push({severity:'warn', summary:'Error al actualizar', detail:'Ha ocurrido un error actualizado el Recurso'});
		}
	}

	getTypeResource(){
		if(this.resource.resource_type == 'view'){
			this.resourceType = Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_DATABASE_VIEW.label;
		} else if(this.resource.resource_type == 'url'){
			this.resourceType = Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_URL_PUBLIC_FILE.label;
		} else if(this.resource.resource_type == 'file'){
			this.resourceType = Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_FILE.label;
		} else{
			if(this.resource.url.includes(window["config"]["AOD_BASE_URL"])){
				var GA_OD_CoreString = "GA_OD_Core";
				if(this.resource.url.includes(GA_OD_CoreString)) { this.resourceType = Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_DATABASE_VIEW.label; }
				else { this.resourceType = Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_FILE.label; }
			} else{
				this.resourceType = Constants.ADMIN_DATASET_EDIT_DROPDOWN_RESOURCE_ACCESS_TYPES_URL_PUBLIC_FILE.label;
			}
		}
	}
}
