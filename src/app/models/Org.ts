export class Org {

    orgName: string;
    orgWeb: string;
    orgDesc: string;
    orgDir: string;
    orgResponsable: string;
    orgContact: string;
    numDatasets: number;

    constructor(orgName: string, orgWeb: string, orgDesc: string, orgDir: string, orgResponsable: string, orgContact: string, numDatasets: number) {
        this.orgName = orgName;
        this.orgWeb = orgWeb;
        this.orgDesc = orgDesc;
        this.orgDir = orgDir;
        this.orgResponsable = orgResponsable;
        this.orgContact = orgContact;
        this.numDatasets = numDatasets;
    }
}