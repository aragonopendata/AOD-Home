import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

    DATASET_LIST_ROWS_PER_PAGE: number;
    DATASET_AUTOCOMPLETE_LIMIT_RESULTS: number;
    AOD_BASE_URL: string;
    PRESUPUESTOS_BASE_URL: string;
    AOD_API_WEB_BASE_URL: string;
    AOD_API_ADMIN_BASE_URL: string;
    
    constructor() {
        this.DATASET_LIST_ROWS_PER_PAGE = 20;
        this.DATASET_AUTOCOMPLETE_LIMIT_RESULTS = 8;
        this.AOD_BASE_URL = 'http://miv-aodfront-01.aragon.local:7030';
        this.PRESUPUESTOS_BASE_URL = 'http://miv-aodfront-01.aragon.local:7031';
        //DEV
        //this.AOD_API_WEB_BASE_URL = 'http://miv-aodfront-01.aragon.local:4200/aod/services/web';
        //this.AOD_API_ADMIN_BASE_URL = 'http://miv-aodfront-01.aragon.local:4200/aod/services/admin';
        //LOCAL
        this.AOD_API_WEB_BASE_URL = 'http://localhost:4200/aod/services/web';
        this.AOD_API_ADMIN_BASE_URL = 'http://localhost:4200/aod/services/admin';
    }
}
