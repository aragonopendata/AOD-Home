export class Org {

    orgName: string;
    orgWeb: string;
    orgDesc: string;
    orgDir: string;
    orgResponsable: string;
    orgContact: string;

    constructor(orgName: string, orgWeb: string, orgDesc: string, orgDir: string, orgResponsable: string, orgContact: string) {
        this.orgName = orgName;
        this.orgWeb = orgWeb;
        this.orgDesc = orgDesc;
        this.orgDir = orgDir;
        this.orgResponsable = orgResponsable;
        this.orgContact = orgContact;
    }
}