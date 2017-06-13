"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dataset = (function () {
    function Dataset(name, url, description, topic, lastUpdate, publicador) {
        this.name = name;
        this.url = url;
        this.description = description;
        this.topic = topic;
        this.lastUpdate = lastUpdate;
        this.publicador = publicador;
        this.untilDate = new Date;
    }
    return Dataset;
}());
exports.Dataset = Dataset;
//# sourceMappingURL=Dataset.js.map