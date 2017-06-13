"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var dataset_service_1 = require("./dataset.service");
describe('DatasetService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [dataset_service_1.DatasetService]
        });
    });
    it('should be created', testing_1.inject([dataset_service_1.DatasetService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=dataset.service.spec.js.map