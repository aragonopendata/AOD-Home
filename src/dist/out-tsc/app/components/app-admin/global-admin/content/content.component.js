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
var ContentComponent = (function () {
    function ContentComponent() {
        this.text = '';
        this.editEnable = false;
    }
    ContentComponent.prototype.ngOnInit = function () {
        this.text = '<h1>Lorem ipsum</h1>' +
            '<br/>' +
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
            'Fusce vel odio molestie, eleifend diam in, auctor mi. ' +
            'Morbi vitae risus orci. Vestibulum quis lorem non purus feugiat lacinia at a dui. ' +
            'Nullam iaculis hendrerit ligula sit amet consectetur. Pellentesque fermentum euismod est ac laoreet. ' +
            'Duis eget vestibulum dolor. Etiam velit ipsum, venenatis vel hendrerit eu, pulvinar quis felis. ' +
            'Nunc rutrum sapien a tincidunt aliquet. Cras et quam nulla. Aliquam nec erat sollicitudin, lobortis mi non, aliquet dolor. ' +
            'Vivamus sodales leo non ornare elementum. Aliquam commodo id quam ac consectetur. ' +
            'Pellentesque felis mauris, consequat ut bibendum a, tempor sit amet turpis. ' +
            'Aliquam sit amet libero nec turpis fermentum vestibulum ut sed turpis. ' +
            'Donec tincidunt nisl at dolor cursus, eget tincidunt purus fringilla.</p>';
        this.listOfObj = [
            { text: this.text, edit: this.editEnable },
            { text: this.text, edit: this.editEnable },
            { text: this.text, edit: this.editEnable }
        ];
    };
    ContentComponent.prototype.save = function (index, text) {
        this.listOfObj[index].edit = !this.listOfObj[index].edit;
        this.listOfObj[index].text = text;
    };
    ContentComponent.prototype.edit = function (index) {
        this.listOfObj[index].edit = !this.listOfObj[index].edit;
    };
    return ContentComponent;
}());
ContentComponent = __decorate([
    core_1.Component({
        selector: 'app-content',
        templateUrl: './content.component.html',
        styleUrls: ['./content.component.css']
    }),
    __metadata("design:paramtypes", [])
], ContentComponent);
exports.ContentComponent = ContentComponent;
//# sourceMappingURL=content.component.js.map