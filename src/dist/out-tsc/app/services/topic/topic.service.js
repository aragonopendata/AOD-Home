"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Topic_1 = require("../../models/Topic");
var TopicService = (function () {
    function TopicService() {
        this.topics = [
            new Topic_1.Topic(1, "Ciencia y tecnología"),
            new Topic_1.Topic(2, "Comercio"),
            new Topic_1.Topic(3, "Cultura y ocio"),
            new Topic_1.Topic(4, "Demografía"),
            new Topic_1.Topic(5, "Deporte"),
            new Topic_1.Topic(6, "Economía"),
            new Topic_1.Topic(7, "Educación"),
            new Topic_1.Topic(8, "Empleo"),
            new Topic_1.Topic(9, "Energía")
        ];
    }
    TopicService.prototype.getTopics = function () {
        return this.topics;
    };
    return TopicService;
}());
TopicService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], TopicService);
exports.TopicService = TopicService;
//# sourceMappingURL=topic.service.js.map