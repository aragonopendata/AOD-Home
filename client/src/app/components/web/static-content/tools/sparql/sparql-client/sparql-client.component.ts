import { Component, OnInit } from '@angular/core';
import { StaticContentService } from '../../../../../../services/web/static-content.service';
import { NgForm } from '@angular/forms/forms';
import { Constants } from '../../../../../../app.constants';
import { GlobalUtils } from '../../../../../../utils/GlobalUtils';

@Component({
	selector: 'app-sparql-client',
	templateUrl: './sparql-client.component.html',
	styleUrls: ['./sparql-client.component.css']
})
export class SparqlClientComponent implements OnInit {

	graph: string;
	query: string;
	format: string;
	timeout: number;
	debug: boolean;
	graphsSelect: string[];
	sparqlResult: string;

	sparqlClientFormatOptionAuto: string;
	sparqlClientFormatOptionHtml: string;
	sparqlClientFormatOptionExcel: string;
	sparqlClientFormatOptionXml: string;
	sparqlClientFormatOptionJson: string;
	sparqlClientFormatOptionJavascript: string;
	sparqlClientFormatOptionPlainText: string;
	sparqlClientFormatOptionRdfXml: string;
	sparqlClientFormatOptionCsv: string;

	// Embebed SPARQL
	public hideEmbed: boolean;
	public showData: number;
	public routeEmbed: any;
	public sparqlQuery: any;

	 //Error Params
	 errorTitle: string;
	 errorMessage: string;

	constructor(private staticContentService: StaticContentService) {
		this.sparqlClientFormatOptionAuto = Constants.SPARQL_CLIENT_FORMAT_OPTIONS_AUTO;
		this.sparqlClientFormatOptionHtml = Constants.SPARQL_CLIENT_FORMAT_OPTIONS_HTML;
		this.sparqlClientFormatOptionExcel = Constants.SPARQL_CLIENT_FORMAT_OPTIONS_EXCEL;
		this.sparqlClientFormatOptionXml = Constants.SPARQL_CLIENT_FORMAT_OPTIONS_XML;
		this.sparqlClientFormatOptionJson = Constants.SPARQL_CLIENT_FORMAT_OPTIONS_JSON;
		this.sparqlClientFormatOptionJavascript = Constants.SPARQL_CLIENT_FORMAT_OPTIONS_JAVASCRIPT;
		this.sparqlClientFormatOptionPlainText = Constants.SPARQL_CLIENT_FORMAT_OPTIONS_PLAIN_TEXT;
		this.sparqlClientFormatOptionRdfXml = Constants.SPARQL_CLIENT_FORMAT_OPTIONS_RDF_XML;
		this.sparqlClientFormatOptionCsv = Constants.SPARQL_CLIENT_FORMAT_OPTIONS_CSV;

		this.hideEmbed = true;
	 }

	ngOnInit() {
		this.setGraphsDropdown();
		this.resetForm();
	}

	setGraphsDropdown(){
		this.graphsSelect = [];
        this.staticContentService.getSparqlGraphs().subscribe(graphs => {
            try {
				let graphsList = JSON.parse(graphs).results.bindings;
				for (var index = 0; index < graphsList.length; index++) {
					var graph = graphsList[index].g.value;
					this.graphsSelect.push(graph);
				}
            } catch (error) {
                console.error('Error: setGraphsDropdown() - sparql-client.component.ts');
                this.errorTitle='Se ha producido un error';
                this.errorMessage='Se ha producido un error en la carga de Grafos, vuelva a intentarlo y si el error persiste contacte con el administrador.';
            }
        });
	}

	resetForm(){
		this.graph = Constants.SPARQL_CLIENT_DEFAULT_GRAPH;
		this.query = Constants.SPARQL_CLIENT_DEFAULT_QUERY;
		this.format = Constants.SPARQL_CLIENT_DEFAULT_FORMAT;
		this.timeout = Constants.SPARQL_CLIENT_DEFAULT_TIMEOUT;
		this.debug = Constants.SPARQL_CLIENT_DEFAULT_DEBUG;
	}

	downloadFile(data, fileType:string){
		let fileFormat = fileType;
		if(fileType == Constants.SPARQL_CLIENT_FORMAT_OPTIONS_AUTO){
			let fileFormat = Constants.SPARQL_CLIENT_FORMAT_OPTIONS_XML;
		}
        let blob = new Blob(['\ufeff' + data], { type: fileType+';charset=utf-8;' });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
        if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
       		dwldLink.setAttribute('target', '_blank');
		}
		dwldLink.setAttribute('href', url);
		switch (fileType) {
			case Constants.SPARQL_CLIENT_FORMAT_OPTIONS_AUTO:
				dwldLink.setAttribute('download', Constants.SPARQL_CLIENT_FILE_NAME + Constants.SPARQL_CLIENT_FORMAT_FILE_EXTENSION_XML);		
			break;
			case Constants.SPARQL_CLIENT_FORMAT_OPTIONS_EXCEL:
				dwldLink.setAttribute('download', Constants.SPARQL_CLIENT_FILE_NAME + Constants.SPARQL_CLIENT_FORMAT_FILE_EXTENSION_XLS);		
			break;

			case Constants.SPARQL_CLIENT_FORMAT_OPTIONS_XML:
			dwldLink.setAttribute('download', Constants.SPARQL_CLIENT_FILE_NAME + Constants.SPARQL_CLIENT_FORMAT_FILE_EXTENSION_SRX);		
			break;

			case Constants.SPARQL_CLIENT_FORMAT_OPTIONS_JSON:
				dwldLink.setAttribute('download', Constants.SPARQL_CLIENT_FILE_NAME + Constants.SPARQL_CLIENT_FORMAT_FILE_EXTENSION_JSON);		
			break;

			case Constants.SPARQL_CLIENT_FORMAT_OPTIONS_JAVASCRIPT:
				dwldLink.setAttribute('download', Constants.SPARQL_CLIENT_FILE_NAME + Constants.SPARQL_CLIENT_FORMAT_FILE_EXTENSION_JS);		
			break;

			case Constants.SPARQL_CLIENT_FORMAT_OPTIONS_PLAIN_TEXT:
				dwldLink.setAttribute('download', Constants.SPARQL_CLIENT_FILE_NAME + Constants.SPARQL_CLIENT_FORMAT_FILE_EXTENSION_TXT);		
			break;

			case Constants.SPARQL_CLIENT_FORMAT_OPTIONS_PLAIN_TEXT:
				dwldLink.setAttribute('download', Constants.SPARQL_CLIENT_FILE_NAME + Constants.SPARQL_CLIENT_FORMAT_FILE_EXTENSION_RDF);		
			break;

			case Constants.SPARQL_CLIENT_FORMAT_OPTIONS_CSV:
				dwldLink.setAttribute('download', Constants.SPARQL_CLIENT_FILE_NAME + Constants.SPARQL_CLIENT_FORMAT_FILE_EXTENSION_CSV);		
			break;
		}
        dwldLink.style.visibility = 'hidden';
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
   }
	

	onSubmit(f: NgForm) {
		this.staticContentService.sendSparqlClient(f.value).subscribe(result => {
			if(f.value.format == Constants.SPARQL_CLIENT_FORMAT_OPTIONS_HTML){
				this.sparqlResult = result;
				this.routeEmbed = Constants.SPARQL_API_BASE_URL +
								  Constants.SPARQL_API_LINK_PARAM_GRAPH + //f.value.graph + 
								  Constants.SPARQL_API_LINK_PARAM_QUERY + f.value.query + 
								  Constants.SPARQL_API_LINK_PARAM_FORMAT + f.value.format +
								  Constants.SPARQL_API_LINK_PARAM_TIMEOUT + f.value.timeout;
				this.routeEmbed = GlobalUtils.formatRequestSPARQL(this.routeEmbed);
				this.sparqlQuery = f.value.query;
			}else{
				this.downloadFile(result,f.value.format);
				
			}
		});
	  }


	hideEmbedButton(n: number) {
		this.hideEmbed = false;
		this.showData = n;
	}
}