export class GlobalUtils {
    constructor(){}

    static generateRandomNumberByRange(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    }

    static formatRequestSPARQL(request) {
        request = this.replaceBlanksRequest(request);
        request = this.replaceQuotesRequest(request);
        request = this.replaceQueryClauses(request);
        request = this.replaceHashRequest(request);
        return request;
    }

    static replaceBlanksRequest(request) {
        return request.replace(/\n|\r/g, "");
    }

    static replaceQuotesRequest(request) {
        return request.replace(new RegExp('"', 'gi'),"'");
    }

    static replaceQueryClauses(query) {
        return query.replace(new RegExp('WHERE', 'gi'), ' WHERE');
    }

    static replaceHashRequest(request) {
        return request.replace(new RegExp('#', 'gi'),'%23');
    }
}