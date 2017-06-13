"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var topic_service_1 = require("./topic.service");
describe('TopicService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [topic_service_1.TopicService]
        });
    });
    it('should be created', testing_1.inject([topic_service_1.TopicService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=topic.service.spec.js.map