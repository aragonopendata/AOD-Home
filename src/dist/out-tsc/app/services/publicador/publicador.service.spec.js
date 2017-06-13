"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var publicador_service_1 = require("./publicador.service");
describe('PublicadorService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [publicador_service_1.PublicadorService]
        });
    });
    it('should be created', testing_1.inject([publicador_service_1.PublicadorService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=publicador.service.spec.js.map